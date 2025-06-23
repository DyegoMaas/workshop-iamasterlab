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
    rules: {
      // 🚨 REGRAS DE MEMOIZAÇÃO - Prevenção de Re-renders Infinitos
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",
      
      // Detecta objetos inline que causam re-renders
      "react/jsx-no-constructed-context-values": "warn",
      
      // Avisa sobre dependências desnecessárias
      "react-hooks/exhaustive-deps": ["error", {
        "additionalHooks": "(useDebounce|useStableValue)"
      }],
      
      // Detecta componentes instáveis
      "react/no-unstable-nested-components": "error"
    }
  }
];

export default eslintConfig;
