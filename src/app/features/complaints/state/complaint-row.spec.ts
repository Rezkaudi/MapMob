import { buildComplaintDetail } from '../testing/complaint-fixture';
import { buildComplaintRow } from './complaint-row';

describe('buildComplaintRow', () => {
  it('shows the reason as the reporter wrote it, and names the status', () => {
    const complaint = buildComplaintDetail({ reason: 'المكان مغلق', status: 'inReview' });

    expect(buildComplaintRow(complaint)).toEqual({
      complaint,
      reasonLabel: 'المكان مغلق',
      statusLabel: 'قيد المراجعة',
    });
  });
});
