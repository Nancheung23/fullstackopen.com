import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        document: "readonly",
        window: "readonly"
      }
    },
    plugins: {
      "@stylistic/js": stylistic
    },
    rules: {
      "no-unused-vars": "warn",
      "eqeqeq": "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": [
        "error", "always"
      ],
      "arrow-spacing": [
        'error', { 'before': true, 'after': true }
      ],
      "no-console": 0,
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "single"],
      "@stylistic/js/semi": ["error", "never"]
    }
  }
];
