import { shortColumnType } from './short-column-type';

describe('shortColumnType', () => {
  it('keeps a short type as is', () => {
    expect(shortColumnType('varchar(120)')).toBe('varchar(120)');
  });

  it('cuts a long enum down to its kind', () => {
    expect(shortColumnType("enum('new-complaint','place-awaiting-approval')")).toBe('enum(…)');
  });

  it('cuts a long type with no brackets at a word', () => {
    expect(shortColumnType('bigint unsigned zerofill extra words')).toBe('bigint…');
  });
});
