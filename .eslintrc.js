module.exports = {
  parserOptions: {
    ecmaVersion: 2022, // La versión de JavaScript que desea usar
    sourceType: "module", // Permite el uso de "import" e "export"
    
  },
  extends: [
    "eslint:recommended", // Reglas recomendadas por ESLint
    "plugin:@typescript-eslint/recommended", // Reglas recomendadas para TypeScript
    "prettier", // Asegura que Prettier y ESLint no entren en conflicto
    'plugin:@next/next/recommended',
  ],

};