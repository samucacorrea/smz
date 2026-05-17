import nextPlugin from "@next/eslint-plugin-next";

const { flatConfig: nextFlatConfig } = nextPlugin;

const config = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "dist/**"],
  },
  nextFlatConfig.recommended,
  nextFlatConfig.coreWebVitals,
];

export default config;
