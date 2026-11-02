import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, fallbackReply } from "@/lib/mentor";
import { chatSchema } from "@/lib/schemas";
import { getSupabase } from "@/lib/supabase";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = buildSystemPrompt();
const MODEL = process.env.BUSLA_MENTOR_MODEL || "claude-opus-5-5";

function textStream(gen: (push: (s: string) => void) => Promise<void>, onDone?: (full: string) => void) {
  const enc = new TextEncoder();
  let full = "";
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const push = (s: string) => {
        full += s;
        controller.enqueue(enc.encode(s));
      };
      try {
        await gen(push);
      } finally {
        controller.close();
        onDone?.(full);
      }
    },
  });
}

async function logTurn(sessionId: string | undefined, userText: string, reply: string) {
  if (process.env.BUSLA_LOG_CHATS !== "true" || !sessionId) return;
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.from("mentor_messages").insert([
    { session_id: sessionId, role: "user", content: userText },
    { session_id: sessionId, role: "assistant", content: reply },
  ]);
  if (error) console.error("chat log failed", error);
}

export async function POST(req: Request) {
  if (!rateLimit(`chat:${clientIp(req)}`, 30, 10 * 60_000)) {
    return new Response("You're sending messages fast. Take a breath and try again in a few minutes 🧭", { status: 429 });
  }
  const parsed = chatSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new Response("Bad request", { status: 400 });

  const { messages, sessionId } = parsed.data;
  if (messages[0].role !== "user") messages.shift();
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" };

  if (!process.env.ANTHROPIC_API_KEY) {
    const reply = fallbackReply(messages);
    void logTurn(sessionId, lastUser, reply);
    return new Response(reply, { headers });
  }

  const client = new Anthropic();
  const stream = textStream(
    async (push) => {
      let wrote = false;
      try {
        const response = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 4000,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          output_config: { effort: "low" },
          system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
          messages,
        });
        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            push(event.delta.text);
            wrote = true;
          }
        }
        const final = await response.finalMessage();
        if (final.stop_reason === "refusal" && !wrote) {
          push("I can't help with that one, but I'm all yours for questions about majors, careers, or the event.");
        } else if (!wrote) {
          push(fallbackReply(messages));
        }
      } catch (err) {
        console.error("mentor stream failed", err);
        push(wrote ? "\n\n_(Connection dropped. Send that again?)_" : fallbackReply(messages));
      }
    },
    (full) => void logTurn(sessionId, lastUser, full),
  );
  return new Response(stream, { headers });
}
