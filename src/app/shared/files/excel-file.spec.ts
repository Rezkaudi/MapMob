import { Workbook } from 'exceljs';
import { EXCEL_TYPE, parseCsv, toExcelFile } from './excel-file';

const BYTE_ORDER_MARK = '﻿';

async function readSheet(file: Blob) {
  const workbook = new Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  return workbook.worksheets[0];
}

describe('parseCsv', () => {
  it('splits rows and cells, dropping the byte-order mark', () => {
    expect(parseCsv(`${BYTE_ORDER_MARK}المعرف,الاسم\r\n174,أبو علي فروج\r\n`)).toEqual([
      ['المعرف', 'الاسم'],
      ['174', 'أبو علي فروج'],
    ]);
  });

  it('keeps commas, quotes and line breaks that sit inside quotes', () => {
    expect(parseCsv('"a,b","say ""hi""","line 1\nline 2"\n,last')).toEqual([
      ['a,b', 'say "hi"', 'line 1\nline 2'],
      ['', 'last'],
    ]);
  });
});

describe('toExcelFile', () => {
  it('turns a CSV export into a right-to-left sheet with every cell as text', async () => {
    const csv = new Blob([`${BYTE_ORDER_MARK}"هاتف المالك",الكود\n0935548460,PL-0174\n`]);

    const file = await toExcelFile(csv);
    const sheet = await readSheet(file);

    expect(file.type).toBe(EXCEL_TYPE);
    expect(sheet.views[0].rightToLeft).toBe(true);
    expect(sheet.getRow(1).values).toEqual([undefined, 'هاتف المالك', 'الكود']);
    expect(sheet.getCell('A2').value).toBe('0935548460');
    expect(sheet.getRow(1).font?.bold).toBe(true);
  });

  it('hands back a file that is already Excel without changing it', async () => {
    const excel = await toExcelFile(new Blob(['a,b\n1,2']));
    const fromServer = new Blob([await excel.arrayBuffer()], { type: 'application/octet-stream' });

    const file = await toExcelFile(fromServer);

    expect(file.type).toBe(EXCEL_TYPE);
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(
      new Uint8Array(await excel.arrayBuffer()),
    );
  });
});
