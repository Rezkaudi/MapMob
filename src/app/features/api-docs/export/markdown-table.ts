const EMPTY_CELL = '—';

function toCell(text: string): string {
  const cell = text
    .replace(/\|/g, '\\|')
    .replace(/\s*\n\s*/g, ' ')
    .trim();
  return cell || EMPTY_CELL;
}

function toLine(cells: readonly string[]): string {
  return `| ${cells.map(toCell).join(' | ')} |`;
}

export function markdownTable(
  head: readonly string[],
  rows: readonly (readonly string[])[],
): string {
  const rule = `| ${head.map(() => '---').join(' | ')} |`;
  return [toLine(head), rule, ...rows.map(toLine)].join('\n');
}
