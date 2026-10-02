import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Why these overrides: `next/typescript` ships `no-explicit-any` and
    // `no-empty-object-type` as errors. Both fire on standard shadcn/Radix
    // primitive patterns (polymorphic `any` props, `interface X extends Y {}`
    // used to re-export a type) and would fail `next build` for cosmetic
    // reasons. Downgrade to warn so lint still surfaces them without blocking
    // the production build. Genuine correctness rules stay as errors.
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        // Allow `_`-prefixed args — the codebase uses that convention for
        // intentionally-unused Express/NextAuth callback params.
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
