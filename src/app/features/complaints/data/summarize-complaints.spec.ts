import { buildComplaintDetail } from '../testing/complaint-fixture';
import { summarizeComplaints } from './summarize-complaints';

describe('summarizeComplaints', () => {
  it('counts every complaint and each status', () => {
    const complaints = [
      buildComplaintDetail({ status: 'new' }),
      buildComplaintDetail({ status: 'new' }),
      buildComplaintDetail({ status: 'inReview' }),
      buildComplaintDetail({ status: 'rejected' }),
    ];

    expect(summarizeComplaints(complaints)).toEqual({
      totalCount: 4,
      newCount: 2,
      inReviewCount: 1,
      resolvedCount: 0,
      rejectedCount: 1,
    });
  });
});
