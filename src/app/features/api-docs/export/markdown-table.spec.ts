import { markdownTable } from './markdown-table';

describe('markdownTable', () => {
  it('writes a head, a rule and one line per row', () => {
    expect(markdownTable(['Name', 'Type'], [['id', 'string']])).toBe(
      '| Name | Type |\n| --- | --- |\n| id | string |',
    );
  });

  it('escapes pipes so enum values stay in their cell', () => {
    expect(markdownTable(['Type'], [['enum: a | b']])).toContain('| enum: a \\| b |');
  });

  it('keeps each row on one line', () => {
    expect(markdownTable(['Note'], [['line one\nline two']])).toContain('| line one line two |');
  });

  it('writes a dash in an empty cell', () => {
    expect(markdownTable(['Note'], [['']])).toContain('| — |');
  });
});
