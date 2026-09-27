import { buildAd, buildAdDetail } from '../testing/ad-fixture';
import { buildAdDetailView } from './ad-detail-view';

describe('buildAdDetailView', () => {
  it('names every field the drawer shows and the action its status allows', () => {
    const view = buildAdDetailView(
      buildAdDetail({
        ad: buildAd({ placeName: 'ألبسة الفاخر', status: 'paused' }),
        position: 'middleBanner',
      }),
    );

    expect(view).toEqual({
      pauseAction: 'resume',
      placeLabel: 'ألبسة الفاخر',
      contentTypeLabel: 'صورة',
      placementLabel: 'الصفحة الرئيسية',
      positionLabel: 'بانر منتصف الصفحة',
      priorityLabel: '5',
      periodLabel: '١٢ يناير ٢٠٢٤ حتى ٢٦ يناير ٢٠٢٤',
    });
  });

  it('names the app itself as the advertiser of an ad with no store', () => {
    const view = buildAdDetailView(
      buildAdDetail({ ad: buildAd({ advertiserType: 'admin', placeName: null }) }),
    );

    expect(view.placeLabel).toBe('إدارة التطبيق');
  });
});
