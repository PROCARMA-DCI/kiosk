import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // allow `any` type
      "@typescript-eslint/no-unused-vars": "off", // allow unused variables
      "no-unused-vars": "off", // base rule (for JS)
      "no-console": "off", // allow console.log
      "no-empty-function": "off", // allow empty functions
      "@typescript-eslint/no-empty-function": "off",
      /* ⚙️ React hook dependencies (disable noisy warnings) */
      "react-hooks/exhaustive-deps": "off",

      /* ⚙️ Allow @ts-ignore */
      "@typescript-eslint/ban-ts-comment": "off",

      /* ⚙️ Allow any type freely */
      "@typescript-eslint/no-explicit-any": "off",

      /* ⚙️ Make unused vars warnings only (not errors) */
      "@typescript-eslint/no-unused-vars": "warn",

      /* ⚙️ Allow normal <img> tags */
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
