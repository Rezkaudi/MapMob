const LINE_BREAK = '\r\n';
const NEEDS_QUOTES = /[",\r\n]/;
/** The byte-order mark lets spreadsheet apps read the Arabic text as UTF-8. */
const BYTE_ORDER_MARK = '﻿';
const CSV_TYPE = 'text/csv;charset=utf-8';

export type CsvRow = readonly string[];

function escapeCell(value: string): string {
  return NEEDS_QUOTES.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function buildCsvText(rows: readonly CsvRow[]): string {
  return rows.map((row) => row.map(escapeCell).join(',')).join(LINE_BREAK);
}

export function buildCsvFile(rows: readonly CsvRow[]): Blob {
  return new Blob([BYTE_ORDER_MARK, buildCsvText(rows)], { type: CSV_TYPE });
}
