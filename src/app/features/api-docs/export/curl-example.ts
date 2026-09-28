import { ApiEndpoint } from '../models/api-endpoint';
import { ApiRequestBody } from '../models/api-request-body';

const LINE_BREAK = ' \\\n  ';
const SAMPLE_RECORD_ID = '12';
const FIRST_PAGE_QUERY = 'pageIndex=0&pageSize=10';
const FILE_RESPONSE_TYPES = new Set(['text/csv']);

function samplePath(endpoint: ApiEndpoint): string {
  return endpoint.samplePath ?? endpoint.path.replace(/\{\w+\}/g, SAMPLE_RECORD_ID);
}

function sampleUrl(endpoint: ApiEndpoint): string {
  const isPaged = endpoint.queryParams?.some((param) => param.name === 'pageIndex');
  const query = isPaged ? `?${FIRST_PAGE_QUERY}` : '';
  return `"$API_BASE_URL${samplePath(endpoint)}${query}"`;
}

function quoteForShell(text: string): string {
  return `'${text.replace(/'/g, `'\\''`)}'`;
}

function formFields(example: unknown): string[] {
  return Object.entries(example as Record<string, unknown>).flatMap(([name, value]) =>
    (Array.isArray(value) ? value : [value]).map((one) => `-F "${name}=${String(one)}"`),
  );
}

function bodyOptions(body: ApiRequestBody): string[] {
  if (body.contentType === 'multipart/form-data') {
    return formFields(body.example);
  }
  return [
    '-H "Content-Type: application/json"',
    `-d ${quoteForShell(JSON.stringify(body.example))}`,
  ];
}

/** A copy-and-run request, reading the base URL and the token from shell variables. */
export function buildCurlExample(endpoint: ApiEndpoint): string {
  const methodOption = endpoint.method === 'GET' ? '' : `-X ${endpoint.method} `;
  const parts = [`curl ${methodOption}${sampleUrl(endpoint)}`];
  if (!endpoint.isPublic) {
    parts.push('-H "Authorization: Bearer $TOKEN"');
  }
  if (endpoint.body) {
    parts.push(...bodyOptions(endpoint.body));
  }
  if (FILE_RESPONSE_TYPES.has(endpoint.response.contentType ?? '')) {
    parts.push('-o export.csv');
  }
  return parts.join(LINE_BREAK);
}
