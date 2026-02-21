import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
        Alwerash
      </h1>
      <p style={{ color: "#52525b", margin: 0 }}>
        Subscription education for design &amp; creative.
      </p>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link
          href="/login"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            background: "#18181b",
            color: "white",
            textDecoration: "none",
          }}
        >
          Log in
        </Link>
        <Link
          href="/register"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "1px solid #d4d4d8",
            color: "#3f3f46",
            textDecoration: "none",
          }}
        >
          Register
        </Link>
        <Link
          href="/dashboard"
          style={{ padding: "0.5rem 1rem", color: "#52525b", textDecoration: "none" }}
        >
          Dashboard
        </Link>
      </nav>
    </main>
  );
}
