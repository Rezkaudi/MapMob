import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const ENV_FILE = '.env';
const EXAMPLE_ENV_FILE = '.env.example';
const OUTPUT_FILE = 'src/environments/environment.ts';
const API_BASE_URL_KEY = 'NG_APP_API_BASE_URL';
const USE_MOCK_API_KEY = 'NG_APP_USE_MOCK_API';

// A value already in the shell wins, so Docker and CI can override the files.
const sourceFile = existsSync(ENV_FILE) ? ENV_FILE : EXAMPLE_ENV_FILE;
if ((!process.env[API_BASE_URL_KEY] || !process.env[USE_MOCK_API_KEY]) && existsSync(sourceFile)) {
  process.loadEnvFile(sourceFile);
}

const apiBaseUrl = process.env[API_BASE_URL_KEY];
if (!apiBaseUrl) {
  console.error(`Missing ${API_BASE_URL_KEY}. Copy ${EXAMPLE_ENV_FILE} to ${ENV_FILE} and fill it in.`);
  process.exit(1);
}

const useMockApi = (process.env[USE_MOCK_API_KEY] ?? 'true').trim().toLowerCase() === 'true';

mkdirSync(dirname(OUTPUT_FILE), { recursive: true });

writeFileSync(
  OUTPUT_FILE,
  `export const environment = {\n  apiBaseUrl: '${apiBaseUrl}',\n  useMockApi: ${useMockApi},\n} as const;\n`,
);

console.log(`Wrote ${OUTPUT_FILE}`);
