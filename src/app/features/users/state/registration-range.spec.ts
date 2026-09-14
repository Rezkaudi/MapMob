import { NO_USER_FILTERS, UserFilters } from '../models/user-filters';
import { resolveRegistrationRange } from './registration-range';

const TODAY = new Date(2026, 8, 15, 10, 0);

function filtersFor(patch: Partial<UserFilters>): UserFilters {
  return { ...NO_USER_FILTERS, ...patch };
}

describe('resolveRegistrationRange', () => {
  it('leaves both ends open for "الكل"', () => {
    expect(resolveRegistrationRange(NO_USER_FILTERS, TODAY)).toEqual({ from: null, to: null });
  });

  it('counts today in the preset periods', () => {
    expect(resolveRegistrationRange(filtersFor({ registrationPeriod: 'today' }), TODAY)).toEqual({
      from: '2026-09-15',
      to: '2026-09-15',
    });
    expect(
      resolveRegistrationRange(filtersFor({ registrationPeriod: 'last7Days' }), TODAY),
    ).toEqual({ from: '2026-09-09', to: '2026-09-15' });
    expect(
      resolveRegistrationRange(filtersFor({ registrationPeriod: 'last30Days' }), TODAY),
    ).toEqual({ from: '2026-08-17', to: '2026-09-15' });
  });

  it('uses the typed range for "نطاق مخصص"', () => {
    const customRange = { from: '2026-08-01', to: '2026-09-02' };

    expect(
      resolveRegistrationRange(filtersFor({ registrationPeriod: 'custom', customRange }), TODAY),
    ).toEqual(customRange);
  });
});
