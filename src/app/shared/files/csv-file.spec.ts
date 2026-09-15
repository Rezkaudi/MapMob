import { buildCsvFile, buildCsvText } from './csv-file';

describe('buildCsvText', () => {
  it('joins the cells with commas and the rows with CRLF, quoting cells that need it', () => {
    const text = buildCsvText([
      ['الاسم', 'التعليق'],
      ['سارة, محمود', 'قال "ممتاز"'],
    ]);

    expect(text.split('\r\n')).toEqual(['الاسم,التعليق', '"سارة, محمود","قال ""ممتاز"""']);
  });
});

describe('buildCsvFile', () => {
  it('makes a UTF-8 CSV file that spreadsheet apps read as Arabic', async () => {
    const file = buildCsvFile([['الاسم'], ['أحمد']]);

    expect(file.type).toBe('text/csv;charset=utf-8');
    const bytes = new Uint8Array(await file.arrayBuffer());
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    expect(await file.text()).toContain('الاسم\r\nأحمد');
  });
});
