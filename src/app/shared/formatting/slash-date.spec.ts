import { SPACED_SLASH, formatSlashDate } from './slash-date';

describe('slash date', () => {
  it('writes a calendar day as dd/mm/yyyy with Latin digits', () => {
    expect(formatSlashDate('2026-09-07')).toBe('07/09/2026');
  });

  it('pads single-digit days and months', () => {
    expect(formatSlashDate('2026-01-01')).toBe('01/01/2026');
  });

  it('spaces the slashes out when asked, as the subscription frame draws dates', () => {
    expect(formatSlashDate('2026-09-01', SPACED_SLASH)).toBe('01 / 09 / 2026');
  });
});
