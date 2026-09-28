import { DbColumn } from '../models/db-column';
import { DbDomain } from '../models/db-domain';
import { DbTable } from '../models/db-table';
import { markdownTable } from './markdown-table';

const MERMAID_KEY: Record<string, string> = { pk: 'PK', fk: 'FK', uq: 'UK' };

/** Mermaid types are one word, so `enum('a','b')` is written `enum`. */
function mermaidType(type: string): string {
  return type.split(/[\s(]/)[0];
}

function mermaidTable(table: DbTable): string {
  const rows = table.columns.map((column) => {
    const key = column.references && column.key === 'pk' ? 'PK, FK' : MERMAID_KEY[column.key ?? ''];
    return `    ${mermaidType(column.type)} ${column.name}${key ? ` ${key}` : ''}`;
  });
  return [`  ${table.name} {`, ...rows, '  }'].join('\n');
}

function mermaidLinks(domain: DbDomain): string[] {
  const names = new Set(domain.tables.map((table) => table.name));
  return domain.tables.flatMap((table) =>
    table.columns
      .filter((column) => column.references && names.has(column.references.split('.')[0]))
      .map((column) => {
        const parent = (column.references ?? '').split('.')[0];
        const parentEnd = column.isNullable ? '|o' : '||';
        return `  ${parent} ${parentEnd}--o{ ${table.name} : "${column.name}"`;
      }),
  );
}

export function mermaidDiagram(domain: DbDomain): string {
  return ['erDiagram', ...mermaidLinks(domain), ...domain.tables.map(mermaidTable)].join('\n');
}

function keyText(column: DbColumn): string {
  const key = column.key ? column.key.toUpperCase() : '';
  if (!column.references) {
    return key;
  }
  const prefix = column.key === 'pk' ? 'PK, FK' : 'FK';
  return `${prefix} → \`${column.references}\``;
}

function tableMarkdown(table: DbTable): string {
  const rows = table.columns.map((column) => [
    `\`${column.name}\``,
    column.type,
    column.isNullable ? 'yes' : 'no',
    keyText(column),
    column.note ?? '',
  ]);
  const parts = [
    `#### \`${table.name}\``,
    `${table.description} Served as: ${table.servedAs}.`,
    markdownTable(['Column', 'Type', 'Null', 'Key', 'Notes'], rows),
  ];
  if (table.indexes?.length) {
    parts.push(`Indexes: ${table.indexes.map((index) => `\`${index}\``).join(', ')}`);
  }
  return parts.join('\n\n');
}

export function databaseMarkdown(domains: readonly DbDomain[]): string {
  return domains
    .map((domain) =>
      [
        `### ${domain.name}`,
        domain.description,
        `\`\`\`mermaid\n${mermaidDiagram(domain)}\n\`\`\``,
        ...domain.tables.map(tableMarkdown),
      ].join('\n\n'),
    )
    .join('\n\n');
}
