export const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/** Every .xlsx is a zip file, and every zip file starts with these bytes ("PK\x03\x04"). */
const ZIP_START = [0x50, 0x4b, 0x03, 0x04];
const BYTE_ORDER_MARK = '﻿';
const SHEET_NAME = 'Sheet1';
const MIN_COLUMN_WIDTH = 8;
const MAX_COLUMN_WIDTH = 60;
// Arabic letters draw wider than Excel's width unit, which is sized for Latin digits.
const WIDTH_PADDING = 4;

function isExcelFile(bytes: Uint8Array): boolean {
  return ZIP_START.every((byte, index) => bytes[index] === byte);
}

/** Reads CSV text into rows of cells, following RFC 4180 (quoted cells may hold commas, quotes and line breaks). */
export function parseCsv(text: string): string[][] {
  const source = text.startsWith(BYTE_ORDER_MARK) ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (quoted) {
      if (char !== '"') {
        cell += char;
      } else if (source[index + 1] === '"') {
        cell += '"';
        index++;
      } else {
        quoted = false;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[index + 1] === '\n') {
        index++;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function columnWidths(rows: readonly string[][]): number[] {
  const widths: number[] = [];
  for (const row of rows) {
    row.forEach((cell, column) => {
      const longestLine = Math.max(...cell.split('\n').map((line) => line.length));
      widths[column] = Math.max(widths[column] ?? 0, longestLine);
    });
  }
  return widths.map((width) =>
    Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, width + WIDTH_PADDING)),
  );
}

/**
 * Builds an Excel sheet from CSV rows. Every cell is kept as text, so phone numbers keep their
 * leading zero and codes are not turned into numbers or dates. The sheet reads right to left.
 */
export async function buildExcelFile(rows: readonly string[][]): Promise<Blob> {
  // Loaded only when someone exports, so the library stays out of the normal page load.
  const excel = await import('exceljs');
  const Workbook =
    excel.Workbook ?? (excel as unknown as { default: typeof excel }).default.Workbook;
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet(SHEET_NAME, {
    views: [{ rightToLeft: true, state: 'frozen', ySplit: rows.length > 0 ? 1 : 0 }],
  });
  for (const row of rows) {
    sheet.addRow(row);
  }
  if (rows.length > 0) {
    sheet.getRow(1).font = { bold: true };
  }
  columnWidths(rows).forEach((width, index) => {
    const column = sheet.getColumn(index + 1);
    column.width = width;
    column.numFmt = '@';
  });
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { type: EXCEL_TYPE });
}

/** Turns a CSV export into an Excel file; a file that is already Excel comes back as it is. */
export async function toExcelFile(file: Blob): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (isExcelFile(bytes)) {
    return file.type === EXCEL_TYPE ? file : new Blob([bytes], { type: EXCEL_TYPE });
  }
  return buildExcelFile(parseCsv(new TextDecoder('utf-8').decode(bytes)));
}
