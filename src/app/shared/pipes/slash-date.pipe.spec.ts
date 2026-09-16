import { SlashDatePipe } from './slash-date.pipe';

describe('SlashDatePipe', () => {
  it('writes a calendar day as dd/mm/yyyy', () => {
    expect(new SlashDatePipe().transform('2026-09-07')).toBe('07/09/2026');
  });

  it('writes an empty string for no value', () => {
    expect(new SlashDatePipe().transform(null)).toBe('');
  });
});
