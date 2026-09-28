import { ApiEndpoint } from '../models/api-endpoint';
import { ApiFeature } from '../models/api-feature';
import { ApiField } from '../models/api-field';
import { errorCasesFor } from '../state/error-cases';
import { pathParamsFor } from '../state/path-params';
import { prettyJson } from '../state/pretty-json';
import { requiredPermission } from '../state/required-permission';
import { buildCurlExample } from './curl-example';
import { markdownTable } from './markdown-table';

const FIELD_HEAD = ['Name', 'Type', 'Required', 'Notes'];

function fieldTable(title: string, fields: readonly ApiField[]): string[] {
  if (fields.length === 0) {
    return [];
  }
  const rows = fields.map((one) => [
    `\`${one.name}\``,
    one.type,
    one.isRequired ? 'yes' : 'no',
    one.description,
  ]);
  return [title, markdownTable(FIELD_HEAD, rows)];
}

function codeBlock(language: string, text: string): string {
  return `\`\`\`${language}\n${text}\n\`\`\``;
}

function facts(feature: ApiFeature, endpoint: ApiEndpoint): string {
  const lines: string[] = [];
  const permission = requiredPermission(feature, endpoint);
  lines.push(
    `**Permission:** ${permission ? `\`${permission}\`` : endpoint.isPublic ? 'none (public)' : 'any signed-in admin'}`,
  );
  lines.push(`**Called from:** \`${feature.screen}\``);
  return lines.join('  \n');
}

function requestParts(endpoint: ApiEndpoint): string[] {
  const body = endpoint.body;
  if (!body) {
    return [];
  }
  return [
    ...fieldTable(`**Request body** (\`${body.contentType}\`)`, body.fields),
    codeBlock('json', prettyJson(body.example)),
  ];
}

function responseParts(endpoint: ApiEndpoint): string[] {
  const { status, description, contentType, example, fields } = endpoint.response;
  const type = contentType ? ` (\`${contentType}\`)` : '';
  const parts = [`**Response** \`${status}\` — ${description}${type}`];
  if (example !== undefined) {
    parts.push(codeBlock('json', prettyJson(example)));
  }
  return [...parts, ...fieldTable('**Response fields**', fields ?? [])];
}

function errorParts(feature: ApiFeature, endpoint: ApiEndpoint): string[] {
  const cases = errorCasesFor(feature, endpoint);
  if (cases.length === 0) {
    return [];
  }
  const rows = cases.map((one) => [
    String(one.status),
    one.when,
    `\`${JSON.stringify(one.example)}\``,
  ]);
  return ['**Errors**', markdownTable(['Status', 'When', 'Body'], rows)];
}

export function endpointMarkdown(feature: ApiFeature, endpoint: ApiEndpoint): string {
  const notes = endpoint.notes ?? [];
  return [
    `<a id="${endpoint.id}"></a>`,
    `#### \`${endpoint.method} ${endpoint.path}\``,
    endpoint.summary,
    facts(feature, endpoint),
    ...fieldTable('**Path parameters**', pathParamsFor(endpoint)),
    ...fieldTable('**Query parameters**', endpoint.queryParams ?? []),
    ...requestParts(endpoint),
    ...responseParts(endpoint),
    ...errorParts(feature, endpoint),
    ...(notes.length > 0 ? ['**Notes**', notes.map((note) => `- ${note}`).join('\n')] : []),
    '**Try it**',
    codeBlock('bash', buildCurlExample(endpoint)),
  ].join('\n\n');
}
