import { formatSlashDate } from './slash-date';

describe('slash date', () => {
  it('writes a calendar day as dd/mm/yyyy with Latin digits', () => {
    expect(formatSlashDate('2026-09-07')).toBe('07/09/2026');
  });

  it('pads single-digit days and months', () => {
    expect(formatSlashDate('2026-01-01')).toBe('01/01/2026');
  });
});
