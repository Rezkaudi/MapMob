import { buildOffer, buildOfferDetail } from '../testing/offer-fixture';
import { buildOfferDetailView, getPlaceInitial } from './offer-detail-view';

describe('getPlaceInitial', () => {
  it('takes the first letter of the last word, past its "ال"', () => {
    expect(getPlaceInitial('ألبسة الجمال')).toBe('ج');
    expect(getPlaceInitial(' صيدلية  الحياة ')).toBe('ح');
    expect(getPlaceInitial('نادي')).toBe('ن');
  });
});

describe('buildOfferDetailView', () => {
  it('offers to pause a running or scheduled offer', () => {
    expect(buildOfferDetailView(buildOfferDetail())).toEqual({
      placeInitial: 'ج',
      pauseAction: 'pause',
    });
    expect(
      buildOfferDetailView(buildOfferDetail({ offer: buildOffer({ status: 'scheduled' }) }))
        .pauseAction,
    ).toBe('pause');
  });

  it('offers to resume a paused offer, and nothing for an expired offer or a draft', () => {
    const actionFor = (status: 'paused' | 'expired' | 'draft') =>
      buildOfferDetailView(buildOfferDetail({ offer: buildOffer({ status }) })).pauseAction;

    expect(actionFor('paused')).toBe('resume');
    expect(actionFor('expired')).toBeNull();
    expect(actionFor('draft')).toBeNull();
  });
});
