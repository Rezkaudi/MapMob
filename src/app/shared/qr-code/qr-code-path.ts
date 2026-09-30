import { QrCodeMatrix } from './qr-code-matrix';

/** One SVG path for the whole code, one unit per module, so the SVG scales without seams. */
export function toQrCodePath(matrix: QrCodeMatrix): string {
  return matrix.map((row, rowIndex) => toRowPath(row, rowIndex)).join('');
}

function toRowPath(row: readonly boolean[], rowIndex: number): string {
  let path = '';
  let column = 0;
  while (column < row.length) {
    if (!row[column]) {
      column++;
      continue;
    }
    const runStart = column;
    while (column < row.length && row[column]) {
      column++;
    }
    const runLength = column - runStart;
    path += `M${runStart} ${rowIndex}h${runLength}v1h-${runLength}z`;
  }
  return path;
}
