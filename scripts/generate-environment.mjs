import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const ENV_FILE = '.env';
const EXAMPLE_ENV_FILE = '.env.example';
const OUTPUT_FILE = 'src/environments/environment.ts';
const API_BASE_URL_KEY = 'NG_APP_API_BASE_URL';
const USE_MOCK_API_KEY = 'NG_APP_USE_MOCK_API';

const readSetting = (key) => process.env[key]?.trim() || undefined;

// An empty shell value means "not set", so CI variables that are missing fall back to the files.
for (const key of [API_BASE_URL_KEY, USE_MOCK_API_KEY]) {
  if (!readSetting(key)) delete process.env[key];
}

// A value already in the shell wins, so Docker and CI can override the files.
const sourceFile = existsSync(ENV_FILE) ? ENV_FILE : EXAMPLE_ENV_FILE;
if ((!readSetting(API_BASE_URL_KEY) || !readSetting(USE_MOCK_API_KEY)) && existsSync(sourceFile)) {
  process.loadEnvFile(sourceFile);
}

const apiBaseUrl = readSetting(API_BASE_URL_KEY);
if (!apiBaseUrl) {
  console.error(`Missing ${API_BASE_URL_KEY}. Copy ${EXAMPLE_ENV_FILE} to ${ENV_FILE} and fill it in.`);
  process.exit(1);
}

const useMockApi = (readSetting(USE_MOCK_API_KEY) ?? 'true').toLowerCase() === 'true';

mkdirSync(dirname(OUTPUT_FILE), { recursive: true });

writeFileSync(
  OUTPUT_FILE,
  `export const environment = {\n  apiBaseUrl: '${apiBaseUrl}',\n  useMockApi: ${useMockApi},\n} as const;\n`,
);

console.log(`Wrote ${OUTPUT_FILE}`);
