import { buildComplaintDetail } from '../testing/complaint-fixture';
import { buildComplaintDetailView } from './complaint-detail-view';

describe('buildComplaintDetailView', () => {
  it('writes the rating and review count the way the place card shows them', () => {
    const view = buildComplaintDetailView(buildComplaintDetail());

    expect(view.ratingLabel).toBe('4.6');
    expect(view.reviewCountLabel).toBe('(120 تقييماً )');
  });

  it('keeps one decimal for a whole rating', () => {
    const complaint = buildComplaintDetail();
    const view = buildComplaintDetailView({
      ...complaint,
      place: { ...complaint.place, rating: 4 },
    });

    expect(view.ratingLabel).toBe('4.0');
  });

  it('links to the reporter profile and the place page', () => {
    const view = buildComplaintDetailView(buildComplaintDetail());

    expect(view.reporterProfileLink).toBe('/users/user-1');
    expect(view.placeLink).toBe('/places/place-4');
  });

  it('names the status for the pill', () => {
    const view = buildComplaintDetailView(buildComplaintDetail({ status: 'rejected' }));

    expect(view.statusLabel).toBe('مرفوض');
  });
});
