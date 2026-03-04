import js from "@eslint/js"
import expoConfig from "eslint-config-expo/flat"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  expoConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    ignores: ["dist/*"],
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
])
