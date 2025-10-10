module.exports = {
  rules: {
    "no-unused-vars": "off",
  },
  parserOptions: {
    ecmaVersion: 2022, // La versión de JavaScript que desea usar
    sourceType: "module", // Permite el uso de "import" e "export"
  },
  extends: [
    "eslint:recommended", // Reglas recomendadas por ESLint
    "plugin:@typescript-eslint/recommended", // Reglas recomendadas para TypeScript
    "plugin:@next/next/recommended",
  ],
};
