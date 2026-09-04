import { existsSync, writeFileSync } from 'node:fs';

const ENV_FILE = '.env';
const EXAMPLE_ENV_FILE = '.env.example';
const OUTPUT_FILE = 'src/environments/environment.ts';
const API_BASE_URL_KEY = 'NG_APP_API_BASE_URL';

// A value already in the shell wins, so Docker and CI can override the files.
const shellApiBaseUrl = process.env[API_BASE_URL_KEY];

const sourceFile = existsSync(ENV_FILE) ? ENV_FILE : EXAMPLE_ENV_FILE;
if (!shellApiBaseUrl && existsSync(sourceFile)) {
  process.loadEnvFile(sourceFile);
}

const apiBaseUrl = shellApiBaseUrl ?? process.env[API_BASE_URL_KEY];
if (!apiBaseUrl) {
  console.error(`Missing ${API_BASE_URL_KEY}. Copy ${EXAMPLE_ENV_FILE} to ${ENV_FILE} and fill it in.`);
  process.exit(1);
}

writeFileSync(
  OUTPUT_FILE,
  `export const environment = {\n  apiBaseUrl: '${apiBaseUrl}',\n} as const;\n`,
);

console.log(`Wrote ${OUTPUT_FILE}`);
