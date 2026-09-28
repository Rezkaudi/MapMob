import { buildAd, buildAdDetail } from '../testing/ad-fixture';
import { buildAdDetailView } from './ad-detail-view';

describe('buildAdDetailView', () => {
  it('names every field the detail page shows and the action its status allows', () => {
    const view = buildAdDetailView(
      buildAdDetail({
        ad: buildAd({ placeName: 'ألبسة الفاخر', status: 'paused' }),
        placeId: 'place-7',
        position: 'middleBanner',
      }),
    );

    expect(view).toEqual({
      pauseAction: 'resume',
      createdOnLabel: 'تاريخ الإنشاء: 01 يناير 2024',
      placeLabel: 'ألبسة الفاخر',
      placeLink: '/admin/places/place-7',
      appPlacementLabel: 'الصفحة الرئيسية (بانر منتصف الصفحة)',
      contentTypeLabel: 'صورة',
      placementLabel: 'الصفحة الرئيسية - بانر منتصف الصفحة',
      priorityLabel: 'أعلى أولوية ( 5)',
      updatedByLabel: 'Admin - 06 يناير 2024',
      startsOnLabel: '12 يناير 2024',
      endsOnLabel: '26 يناير 2024',
      metricCards: [
        { kind: 'impressions', label: 'مرات الظهور', value: '48,250', suffix: '' },
        { kind: 'clicks', label: 'عدد النقرات', value: '3,860', suffix: '' },
        { kind: 'clickRate', label: 'نسبة النقر (CTR)', value: '8.00%', suffix: '' },
        { kind: 'uniqueUsers', label: 'المستخدمون', value: '34,120', suffix: 'مستمع / مشاهد' },
      ],
    });
  });

  it('names the app itself as the advertiser of an ad with no store, and links nowhere', () => {
    const view = buildAdDetailView(
      buildAdDetail({ ad: buildAd({ advertiserType: 'admin', placeName: null }), placeId: null }),
    );

    expect(view.placeLabel).toBe('إدارة التطبيق');
    expect(view.placeLink).toBeNull();
  });

  it('writes a dash for an ad that never ends', () => {
    const view = buildAdDetailView(buildAdDetail({ ad: buildAd({ endsOn: null }) }));

    expect(view.endsOnLabel).toBe('غير محدد');
  });
});
