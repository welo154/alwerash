"use client";

import { AnimatePresence, motion } from "motion/react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { CompassGlyph } from "./Compass";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "I don't know what I want to study",
  "Which Busla activities fit me?",
  "Help me compare two majors",
  "عايز أعرف أدخل كلية إيه",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, I'm **Compass** 🧭 I help you figure out majors worth exploring and which Busla sessions to hit.\n\nTell me about yourself: what grade you're in and something you genuinely enjoy doing.",
};

/** Tiny, safe Markdown subset: paragraphs, bullet lists, **bold**, *italic*. No HTML injection. */
function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (/^(\*[^*]+\*|_[^_]+_)$/.test(p)) return <em key={i}>{p.slice(1, -1)}</em>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

function Markdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="chat-md" dir="auto">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ""))}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function sessionId() {
  try {
    let id = sessionStorage.getItem("busla-session");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("busla-session", id);
    }
    return id;
  } catch {
    return undefined;
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const send = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content) return;
    const history = [...messagesRef.current, { role: "user" as const, content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // greeting is UI-only; the API expects the conversation to start with the user
        body: JSON.stringify({ sessionId: sessionId(), messages: history.slice(1).slice(-30) }),
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        const snapshot = acc;
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: snapshot }]);
      }
      if (!acc) throw new Error("empty");
    } catch {
      setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: "Hmm, I lost the signal. Try sending that again?" }]);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      setOpen(true);
      if (prompt) setTimeout(() => send(prompt), 250);
      else setTimeout(() => inputRef.current?.focus(), 300);
    };
    window.addEventListener("busla:open-mentor", onOpen);
    return () => window.removeEventListener("busla:open-mentor", onOpen);
  }, [send]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const reset = () => setMessages([GREETING]);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full border-2 border-ink bg-saffron p-2 font-bold sm:pr-5 shadow-[4px_4px_0_var(--color-ink)] sm:right-6"
            aria-label="Open Compass, the AI mentor"
          >
            <span className="grid h-10 w-10 animate-wobble place-items-center rounded-full bg-ink text-saffron">
              <CompassGlyph className="h-6 w-6" />
            </span>
            <span className="hidden sm:inline">Ask Compass</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Compass AI mentor"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            style={{ transformOrigin: "bottom right" }}
            data-lenis-prevent
            className="fixed inset-x-2 bottom-2 z-50 flex h-[min(42rem,calc(100dvh-1rem))] flex-col overflow-hidden rounded-[1.75rem] border-2 border-ink bg-paper shadow-[6px_6px_0_var(--color-ink)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[25rem]"
          >
            <header className="flex items-center gap-3 border-b-2 border-ink bg-ink px-4 py-3 text-cream">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-saffron text-ink">
                <CompassGlyph className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="display text-lg leading-none">Compass</p>
                <p className="mt-1 text-xs text-cream/70">Your Busla mentor · AI, can make mistakes</p>
              </div>
              <button onClick={reset} className="rounded-full px-2 py-1 text-xs text-cream/70 hover:bg-cream/10" title="Start over">
                Reset
              </button>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-cream/10 text-xl hover:bg-brick" aria-label="Close">
                ×
              </button>
            </header>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed ${
                    m.role === "user" ? "ml-auto rounded-br-sm bg-nile text-cream" : "rounded-bl-sm border-2 border-ink bg-cream"
                  }`}
                >
                  {m.content ? (
                    m.role === "user" ? <p dir="auto" className="whitespace-pre-wrap">{m.content}</p> : <Markdown text={m.content} />
                  ) : (
                    <span className="flex gap-1 py-1.5" aria-label="Compass is typing">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="h-2 w-2 rounded-full bg-ink"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }}
                        />
                      ))}
                    </span>
                  )}
                </motion.div>
              ))}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      dir="auto"
                      onClick={() => send(s)}
                      className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-medium transition-colors hover:bg-lime"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!busy) send(input);
              }}
              className="flex items-end gap-2 border-t-2 border-ink bg-cream p-3"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 2000))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!busy) send(input);
                  }
                }}
                rows={1}
                dir="auto"
                placeholder="Type in English or Arabic…"
                className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border-2 border-ink bg-paper px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-nile"
                aria-label="Message Compass"
              />
              <button
                disabled={busy || !input.trim()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-brick text-cream transition-transform enabled:hover:-rotate-12 disabled:opacity-40"
                aria-label="Send"
              >
                ↑
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
