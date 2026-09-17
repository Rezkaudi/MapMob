import { buildComplaintDetail } from '../testing/complaint-fixture';
import { buildComplaintRow } from './complaint-row';

describe('buildComplaintRow', () => {
  it('names the reason and the status for the table', () => {
    const complaint = buildComplaintDetail({ reason: 'closedPlace', status: 'inReview' });

    expect(buildComplaintRow(complaint)).toEqual({
      complaint,
      reasonLabel: 'المكان مغلق',
      statusLabel: 'قيد المراجعة',
    });
  });
});
