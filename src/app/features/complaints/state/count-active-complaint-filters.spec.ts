import { NO_COMPLAINT_FILTERS } from '../models/complaint-filters';
import { countActiveComplaintFilters } from './count-active-complaint-filters';

describe('countActiveComplaintFilters', () => {
  it('counts nothing when every group is "الكل"', () => {
    expect(countActiveComplaintFilters(NO_COMPLAINT_FILTERS)).toBe(0);
  });

  it('counts the status and the report period', () => {
    expect(
      countActiveComplaintFilters({
        ...NO_COMPLAINT_FILTERS,
        status: 'resolved',
        reportPeriod: 'last7Days',
      }),
    ).toBe(2);
  });
});
