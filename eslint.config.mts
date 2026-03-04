import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import { defineConfig } from "eslint/config"
import globals from "globals"
import { createRequire } from "module"
import { configs as tseslintConfigs } from "typescript-eslint"
const require = createRequire(import.meta.url)
const expoConfig = require("eslint-config-expo/flat")

export default defineConfig([
  expoConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    ignores: ["dist/*"],
  },
  tseslintConfigs.recommended,
  eslintConfigPrettier,
  {
    settings: {
      react: { version: "19" }, // Avoids auto-detection crash
    },
  },
  {
    ignores: [
      "node_modules/*",
      "dist/*",
      "android/*",
      "ios/*",
      "*.cjs",
      "**/*.cjs",
    ],
  },
])
