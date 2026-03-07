import nextVitals from "eslint-config-next/core-web-vitals";
import type { Linter } from "eslint";

const config: Linter.Config[] = [...nextVitals];

export default config;
