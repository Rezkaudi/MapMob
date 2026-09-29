import { CURRENT_RECORD } from '../testing/merchant-subscription-fixture';
import { isRenewalDue } from './renewal-window';

describe('renewal window', () => {
  it('stays shut while more than a week is left', () => {
    expect(isRenewalDue(CURRENT_RECORD, '2026-09-20')).toBe(false);
  });

  it('opens in the last week of the period', () => {
    expect(isRenewalDue(CURRENT_RECORD, '2026-09-24')).toBe(true);
    expect(isRenewalDue(CURRENT_RECORD, '2026-10-01')).toBe(true);
  });

  it('opens once the period has run out', () => {
    expect(isRenewalDue({ ...CURRENT_RECORD, status: 'expired' }, '2026-09-02')).toBe(true);
    expect(isRenewalDue(CURRENT_RECORD, '2026-10-05')).toBe(true);
  });
});
