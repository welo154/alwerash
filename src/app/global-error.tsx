"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              padding: "2rem",
              textAlign: "center",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              backgroundColor: "#fff",
            }}
          >
            <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0f172a" }}>
              Something went wrong
            </h1>
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#64748b" }}>
              A critical error occurred. Please refresh the page or try again later.
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#fff",
                  backgroundColor: "#0f172a",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#334155",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                }}
              >
                Back to home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
