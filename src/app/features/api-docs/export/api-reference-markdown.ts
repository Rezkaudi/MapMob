import { ApiFeature } from '../models/api-feature';
import { ApiReference } from '../models/api-reference';
import { DocsSection } from '../models/docs-section';
import { HTTP_METHODS } from '../models/http-method';
import { countEndpoints } from '../state/count-endpoints';
import { FeatureGroup, groupFeaturesByApp } from '../state/feature-groups';
import { wholeDatabase } from '../state/whole-database';
import { databaseMarkdown, mermaidDiagram } from './markdown-database';
import { endpointMarkdown } from './markdown-endpoint';
import { markdownTable } from './markdown-table';

const CONTENTS = [
  '1. [Conventions](#conventions)',
  '2. [Endpoints](#endpoints)',
  '3. [Database](#database)',
  '4. [Build order](#build-order)',
  '5. [Open questions](#open-questions)',
].join('\n');

function summaryTable(reference: ApiReference): string {
  const { total, byMethod } = countEndpoints(reference.features);
  return markdownTable(
    ['Endpoints', ...HTTP_METHODS],
    [[total, ...HTTP_METHODS.map((method) => byMethod[method])].map(String)],
  );
}

function conventionMarkdown(section: DocsSection): string {
  const parts = [`### ${section.title}`, ...section.paragraphs];
  if (section.table) {
    parts.push(markdownTable(section.table.head, section.table.rows));
  }
  if (section.code) {
    parts.push(`\`\`\`\n${section.code}\n\`\`\``);
  }
  return parts.join('\n\n');
}

function featureMarkdown(feature: ApiFeature): string {
  const rows = feature.endpoints.map((endpoint) => [
    `\`${endpoint.method}\``,
    `[\`${endpoint.path}\`](#${endpoint.id})`,
    endpoint.summary,
  ]);
  return [
    `### ${feature.name}`,
    `${feature.intro} Screen: \`${feature.screen}\`.`,
    markdownTable(['Method', 'Path', 'What it does'], rows),
    ...feature.endpoints.map((endpoint) => endpointMarkdown(feature, endpoint)),
  ].join('\n\n');
}

function featureGroupMarkdown(group: FeatureGroup): string {
  const endpointCount = countEndpoints(group.features).total;
  return [
    `**${group.title}** — ${endpointCount} endpoints`,
    ...group.features.map(featureMarkdown),
  ].join('\n\n');
}

/** The whole reference as one README-style Markdown file. */
export function buildApiReferenceMarkdown(reference: ApiReference): string {
  return (
    [
      `# ${reference.title}`,
      `What the backend must provide for the admin dashboard and the place owner app. Updated ${reference.updatedOn}. Every path is relative to the API base URL.`,
      summaryTable(reference),
      '## Contents',
      CONTENTS,
      '## Conventions',
      ...reference.conventions.map(conventionMarkdown),
      '## Endpoints',
      ...groupFeaturesByApp(reference.features).map(featureGroupMarkdown),
      '## Database',
      'A MySQL schema (Laravel migrations) that serves every endpoint above. Column names are snake_case; the API maps them to camelCase.',
      '### Complete ERD',
      'Every table and every relationship, including the links between groups.',
      `\`\`\`mermaid\n${mermaidDiagram(wholeDatabase(reference.domains, reference.wholeErdLayout))}\n\`\`\``,
      databaseMarkdown(reference.domains),
      '## Build order',
      markdownTable(reference.buildOrder.head, reference.buildOrder.rows),
      '## Open questions',
      reference.openQuestions.map((question, index) => `${index + 1}. ${question}`).join('\n'),
    ].join('\n\n') + '\n'
  );
}
