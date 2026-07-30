import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from "cursor/canvas";

/**
 * Architecture-derived capacity model for Alwerash.
 * Source: codebase hot paths (ProgressTracker 5s PATCH, Prisma pool ≥15,
 * uncached catalog fan-out, Mux offload, local disk uploads). Not a live
 * production soak — numbers are modeled ceilings with safety margins.
 */

type TierId = "as_built" | "tuned" | "scaled";

const TIERS: Record<
  TierId,
  {
    label: string;
    registered: string;
    concurrentWatch: string;
    concurrentBrowse: string;
    mauComfort: string;
    verdict: string;
    tone: "warning" | "info" | "success";
  }
> = {
  as_built: {
    label: "As built today",
    registered: "5k–15k",
    concurrentWatch: "50–100",
    concurrentBrowse: "200–400",
    mauComfort: "~2k–5k",
    verdict: "Pilot / soft launch",
    tone: "warning",
  },
  tuned: {
    label: "Tuned (same stack)",
    registered: "50k–100k",
    concurrentWatch: "250–500",
    concurrentBrowse: "1k–2k",
    mauComfort: "~15k–40k",
    verdict: "Growth-ready",
    tone: "info",
  },
  scaled: {
    label: "Scaled production",
    registered: "500k–1M+",
    concurrentWatch: "2k–5k",
    concurrentBrowse: "10k+",
    mauComfort: "~100k–300k",
    verdict: "Multi-tenant ready",
    tone: "success",
  },
};

const BOTTLENECKS = [
  {
    rank: "1",
    name: "Postgres connection pool",
    why: "Prisma floors connection_limit at 15 per Node process. Parallel SSR + progress PATCHes compete for the same pool.",
    limit: "Saturates first under concurrent watchers",
  },
  {
    rank: "2",
    name: "Lesson progress writes",
    why: "Each watcher ≈ 1 PATCH / 5s ≈ 0.2 writes/s. Each PATCH ≈ 5–7 DB round-trips (auth + upsert + daily aggregates).",
    limit: "~1.6 DB queries/s per concurrent watcher",
  },
  {
    rank: "3",
    name: "Uncached catalog / home SSR",
    why: "/course runs 6 parallel publicList* queries; /home runs 4+. No Redis / unstable_cache.",
    limit: "Browse spikes exhaust pool before Mux does",
  },
  {
    rank: "4",
    name: "Session callback DB tax",
    why: "Every auth()/getServerSession hits User (+ profession) even with JWT strategy.",
    limit: "Multiplies cost of every protected page/API",
  },
  {
    rank: "5",
    name: "Local disk uploads",
    why: "Avatars, mentor photos, submission files write to public/. Breaks on multi-instance / serverless.",
    limit: "Hard ceiling on horizontal scale — not a soft QPS limit",
  },
];

const MATH_ROWS = [
  ["Progress debounce", "5,000 ms", "ProgressTracker.tsx"],
  ["PATCH rate / watcher", "≈ 0.2 / s", "1 write every 5s while watching"],
  ["DB ops / PATCH", "5–7", "auth + lesson + txn upserts"],
  ["Query load / watcher", "≈ 1.6 qps", "progress path only"],
  ["Prisma pool floor", "≥ 15 conns", "prisma.ts MIN_CONNECTION_LIMIT"],
  ["Pool hold (est.)", "~50–150 ms", "per query under load"],
  ["Catalog SSR queries", "6 parallel", "/course page"],
  ["Home SSR queries", "4+ parallel", "/home page"],
  ["Video egress", "Mux CDN", "Does not hit app CPU/bandwidth"],
  ["Rate limiting", "None", "Abuse can burn the pool early"],
];

/** Concurrent watchers the pool can sustain (conservative). */
function watchersFromPool(poolSize: number, otherTrafficShare: number): number {
  // Max QPS ≈ pool / avgHoldSec; progress needs ~1.6 qps/watcher
  const avgHoldSec = 0.1;
  const maxQps = poolSize / avgHoldSec;
  const progressQpsBudget = maxQps * (1 - otherTrafficShare);
  return Math.floor(progressQpsBudget / 1.6);
}

export default function PlatformCapacityCanvas() {
  const theme = useHostTheme();
  const asBuiltWatch = watchersFromPool(15, 0.35);
  const tunedWatch = watchersFromPool(40, 0.25);
  const scaledWatch = watchersFromPool(120, 0.2);

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 960 }}>
      <Stack gap={8}>
        <H1>Alwerash capacity — how many users?</H1>
        <Text tone="secondary">
          Deep capacity model from the live codebase (Next.js 15 + Prisma +
          Supabase Postgres + Mux). Not a live soak test against production —
          ceilings are derived from real hot paths with safety margins.
        </Text>
        <Row gap={8} wrap>
          <Pill tone="warning" active>
            Hard limit: concurrent watchers
          </Pill>
          <Pill tone="info">Soft limit: registered accounts</Pill>
          <Pill>Video scale: Mux (off-app)</Pill>
        </Row>
      </Stack>

      <Callout tone="warning" title="Headline answer (as built today)">
        Comfortably run a pilot of about 5,000–15,000 registered users, with
        roughly 50–100 people watching lessons at the same time (≈ 200–400
        browsing). Lifetime account count is not the wall — concurrent lesson
        watching against the Postgres pool is.
      </Callout>

      <Grid columns={3} gap={12}>
        <Stat
          value={TIERS.as_built.concurrentWatch}
          label="Concurrent watchers (today)"
          tone="warning"
        />
        <Stat
          value={TIERS.as_built.registered}
          label="Registered users (comfortable)"
          tone="info"
        />
        <Stat
          value={TIERS.as_built.mauComfort}
          label="Monthly active (comfortable)"
        />
      </Grid>

      <Divider />

      <Stack gap={12}>
        <H2>Capacity by maturity tier</H2>
        <Text tone="secondary" size="small">
          Source: architecture model · pool math uses 100ms avg query hold ·
          1.6 progress qps per watcher
        </Text>
        <Table
          headers={[
            "Tier",
            "Registered",
            "Watching now",
            "Browsing now",
            "MAU comfort",
            "Verdict",
          ]}
          rows={(Object.keys(TIERS) as TierId[]).map((id) => {
            const t = TIERS[id];
            return [
              t.label,
              t.registered,
              t.concurrentWatch,
              t.concurrentBrowse,
              t.mauComfort,
              <Pill key={id} tone={t.tone} active size="sm">
                {t.verdict}
              </Pill>,
            ];
          })}
          rowTone={["warning", "info", "success"]}
        />
      </Stack>

      <Card>
        <CardHeader>Modeled concurrent watchers vs Postgres pool size</CardHeader>
        <CardBody>
          <BarChart
            categories={["Pool 15 (today)", "Pool 40 (tuned)", "Pool 120 (scaled)"]}
            series={[
              {
                name: "Max concurrent video watchers (est.)",
                data: [asBuiltWatch, tunedWatch, scaledWatch],
                tone: "info",
              },
            ]}
            height={220}
          />
          <Text tone="secondary" size="small">
            Formula: watchers ≈ (pool ÷ 0.1s hold) × (1 − other traffic) ÷ 1.6
            qps/watcher. Other traffic assumed 35% / 25% / 20%.
          </Text>
        </CardBody>
      </Card>

      <Stack gap={12}>
        <H2>What “users” means here</H2>
        <Grid columns={2} gap={12}>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm" active>Hard</Pill>}>
              Concurrent watching
            </CardHeader>
            <CardBody>
              <Text>
                People actively streaming a lesson. Each one writes progress
                every 5 seconds. This is the real ceiling today.
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill size="sm">Soft</Pill>}>
              Registered / lifetime
            </CardHeader>
            <CardBody>
              <Text>
                Accounts in Postgres. Storage scales fine into hundreds of
                thousands of rows; UX and cost matter more than row count.
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">Separate</Pill>}>
              Video viewers (Mux)
            </CardHeader>
            <CardBody>
              <Text>
                HLS is served by Mux CDN. App bandwidth is not the limit —
                Mux plan + signed playback tokens are.
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill size="sm">Derived</Pill>}>
              Monthly active (MAU)
            </CardHeader>
            <CardBody>
              <Text>
                If ~2–5% of MAU watch at peak hour, 5k MAU ≈ 100–250 peak
                watchers — already near today’s hard limit.
              </Text>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={12}>
        <H2>Bottleneck ranking</H2>
        <Table
          headers={["#", "Bottleneck", "Why", "Effect"]}
          rows={BOTTLENECKS.map((b) => [b.rank, b.name, b.why, b.limit])}
          rowTone={["danger", "warning", "warning", "info", "neutral"]}
        />
      </Stack>

      <Stack gap={12}>
        <H2>Raw inputs from the codebase</H2>
        <Table
          headers={["Input", "Value", "Notes"]}
          rows={MATH_ROWS}
        />
      </Stack>

      <Divider />

      <Stack gap={12}>
        <H2>What unlocks each tier</H2>
        <Grid columns={1} gap={12}>
          <Card>
            <CardHeader>
              <Row gap={8} align="center">
                <Pill tone="warning" active size="sm">
                  As built
                </Pill>
                <Text weight="semibold">Do nothing — pilot only</Text>
              </Row>
            </CardHeader>
            <CardBody>
              <Text>
                Single Node process, connection_limit ≥ 15, uncached catalog,
                progress PATCH every 5s, local disk uploads, no rate limits.
                Fine for cohorts and demos; risky for a viral launch day.
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Row gap={8} align="center">
                <Pill tone="info" active size="sm">
                  Tuned
                </Pill>
                <Text weight="semibold">Same stack, smarter paths</Text>
              </Row>
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text>• Raise pool (e.g. 30–40) on a larger Supabase compute</Text>
                <Text>• Cache /course and /home (unstable_cache or CDN)</Text>
                <Text>• Stop DB hits in JWT session callback</Text>
                <Text>• Widen progress debounce to 10–15s or batch writes</Text>
                <Text>• Add rate limits on progress + auth</Text>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Row gap={8} align="center">
                <Pill tone="success" active size="sm">
                  Scaled
                </Pill>
                <Text weight="semibold">Production architecture</Text>
              </Row>
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text>• 2–4 Node instances behind a load balancer</Text>
                <Text>• Redis (or similar) for catalog + session cache</Text>
                <Text>• Object storage (S3/R2) for photos & submissions</Text>
                <Text>• Progress write queue / batch upserts</Text>
                <Text>• Observability + load tests (k6) before each release</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Callout tone="info" title="What this is — and is not">
        This is a deep architecture capacity test grounded in your real
        ProgressTracker, Prisma pool, and page query fan-out. It is not a live
        k6 soak against your Supabase project. Absolute numbers shift with your
        Supabase plan size, host CPU, and Mux tier. If you want, next step is a
        scripted load test against staging with measured p95 latency and error
        rates.
      </Callout>

      <H3>Practical recommendation</H3>
      <Text>
        Treat <Text weight="semibold">~100 concurrent learners</Text> as today’s
        safe peak, and plan tuning before you market past{" "}
        <Text weight="semibold">~5k–10k registered</Text> with regular daily
        watching. Mux will carry video; Postgres + progress writes will decide
        whether the app stays healthy.
      </Text>

      <Spacer />
      <Text tone="tertiary" size="small">
        Theme: {theme.kind} · Model date: 2026-07-30 · Stack: Next 15.5 /
        Prisma 6 / Supabase Postgres / Mux / Resend
      </Text>
    </Stack>
  );
}
