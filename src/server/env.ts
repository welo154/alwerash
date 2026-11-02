/**
 * Startup check for server configuration.
 *
 * Only settings without which the site cannot work at all (database, auth
 * secret) or would give paid access away (self-grant) stop the server. Missing
 * feature credentials (video, email, storage, payments) are logged as one clear
 * warning list at startup, and the rest of the site keeps serving. Those
 * features fail on their own until configured.
 */

type Env = Record<string, string | undefined>;

export type EnvReport = {
  /** The site cannot run safely. Fatal in production. */
  errors: string[];
  /** A feature is missing or misconfigured. Logged; the site keeps serving. */
  warnings: string[];
};

const PLACEHOLDER = /^(replace-with|your[-_]|changeme|vercel-build-placeholder)/i;

function value(env: Env, name: string): string {
  return env[name]?.trim() ?? "";
}

function firstSet(env: Env, names: string[]): string {
  for (const name of names) {
    const v = value(env, name);
    if (v) return v;
  }
  return "";
}

/** Feature credentials expected in production. Missing ones are warnings. */
const FEATURES_IN_PRODUCTION: { feature: string; names: string[] }[] = [
  { feature: "Video", names: ["MUX_TOKEN_ID", "MUX_TOKEN_SECRET", "MUX_SIGNING_KEY_ID", "MUX_PRIVATE_KEY", "MUX_WEBHOOK_SECRET"] },
  { feature: "Email", names: ["RESEND_API_KEY", "RESEND_FROM_EMAIL"] },
  { feature: "File storage", names: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] },
  { feature: "Payments", names: ["POLAR_ACCESS_TOKEN", "POLAR_PRODUCT_ID", "POLAR_WEBHOOK_SECRET"] },
];

export function checkServerEnv(env: Env = process.env): EnvReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const production = env.NODE_ENV === "production";

  const databaseUrl = firstSet(env, ["DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL"]);
  if (!databaseUrl) {
    errors.push("DATABASE_URL is not set.");
  } else if (!/^postgres(ql)?:\/\//i.test(databaseUrl.replace(/^["']/, ""))) {
    errors.push("DATABASE_URL must start with postgresql://.");
  }

  const secret = firstSet(env, ["AUTH_SECRET", "NEXTAUTH_SECRET"]);
  if (!secret) {
    errors.push("AUTH_SECRET is not set. Generate one with: openssl rand -base64 32");
  } else if (PLACEHOLDER.test(secret)) {
    errors.push("AUTH_SECRET is still a placeholder value.");
  } else if (secret.length < 32) {
    warnings.push("AUTH_SECRET is shorter than 32 characters. Use: openssl rand -base64 32");
  }

  const authUrl = firstSet(env, ["AUTH_URL", "NEXTAUTH_URL"]);
  if (!authUrl) {
    warnings.push("AUTH_URL is not set. Email links and payment redirects will point at localhost.");
  } else if (production && !authUrl.startsWith("https://")) {
    warnings.push(`AUTH_URL should use https in production (got ${authUrl}).`);
  }

  if (!production) return { errors, warnings };

  for (const { feature, names } of FEATURES_IN_PRODUCTION) {
    const missing = names.filter((name) => !value(env, name) || PLACEHOLDER.test(value(env, name)));
    if (missing.length > 0) {
      warnings.push(`${feature} will not work: missing ${missing.join(", ")}.`);
    }
  }

  const selfGrant = value(env, "SUBSCRIPTION_SELF_GRANT_ENABLED").toLowerCase();
  if (selfGrant === "true" || selfGrant === "1") {
    errors.push(
      "SUBSCRIPTION_SELF_GRANT_ENABLED is on, so anyone can unlock paid access without paying."
    );
  }

  if (value(env, "POLAR_SERVER").toLowerCase() !== "production") {
    warnings.push("POLAR_SERVER is not \"production\": checkout uses the Polar sandbox.");
  }
  if (value(env, "CATALOG_SHOW_UNPUBLISHED")) {
    warnings.push("CATALOG_SHOW_UNPUBLISHED is set: unpublished courses are visible to the public.");
  }

  return { errors, warnings };
}

/**
 * Log the report and, in production, refuse to start on errors (database or
 * auth secret missing, or self-grant on). Warnings never stop the server.
 * Set SKIP_ENV_VALIDATION=1 to bypass in an emergency.
 */
export function assertServerEnv(env: Env = process.env): void {
  if (value(env, "SKIP_ENV_VALIDATION") === "1") return;

  const { errors, warnings } = checkServerEnv(env);
  if (warnings.length > 0) {
    console.warn(`[env] Configuration warnings:\n${warnings.map((w) => `  - ${w}`).join("\n")}`);
  }
  if (errors.length === 0) return;

  const message = `Invalid server configuration:\n${errors.map((e) => `  - ${e}`).join("\n")}`;
  if (env.NODE_ENV === "production") {
    throw new Error(message);
  }
  console.warn(`[env] ${message}`);
}
