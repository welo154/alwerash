// ESLint flat config (Next.js 16 removed `next lint`; run with `npm run lint`).
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "public/**", "docs/**", "skills/**", ".claude/**", ".agents/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  {
    // New React Compiler rules in eslint-config-next 16. They flag patterns the
    // compiler cannot optimise (setState inside effects, ref reads during render,
    // mutating values after render), not current bugs. Warnings until the 42
    // existing cases are reworked; see docs/IMPROVEMENTS_AND_PAYMENTS.md.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
    },
  },
];

export default config;
