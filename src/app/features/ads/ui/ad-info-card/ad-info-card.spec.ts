import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdDetail } from '../../models/ad-detail';
import { buildAdDetailView } from '../../state/ad-detail-view';
import { buildAd, buildAdDetail } from '../../testing/ad-fixture';
import { AdInfoCard } from './ad-info-card';

function render(detail: AdDetail): HTMLElement {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(AdInfoCard);
  fixture.componentRef.setInput('detail', detail);
  fixture.componentRef.setInput('view', buildAdDetailView(detail));
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('AdInfoCard', () => {
  it('labels every field the design lists, in order', () => {
    const labels = Array.from(render(buildAdDetail()).querySelectorAll('dt')).map((term) =>
      term.textContent?.trim(),
    );

    expect(labels).toEqual([
      'عنوان الإعلان',
      'المتجر / المكان المرتبط',
      'نوع المحتوى',
      'مكان الظهور بالتطبيق',
      'الأولوية والترتيب',
      'آخر تعديل بواسطة',
      'الوصف التفصيلي للإعلان',
    ]);
  });

  it('links the linked store, with the name before the arrow', () => {
    const link = render(buildAdDetail({ placeId: 'place-3' })).querySelector('a') as HTMLElement;

    expect(link.getAttribute('href')).toBe('/places/place-3');
    expect(link.firstElementChild?.textContent?.trim()).toBe('صيدلية الحياة');
    expect(link.lastElementChild?.tagName.toLowerCase()).toBe('app-icon');
  });

  it('writes the app itself as plain text, with nowhere to open', () => {
    const element = render(
      buildAdDetail({ ad: buildAd({ advertiserType: 'admin', placeName: null }), placeId: null }),
    );

    expect(element.querySelector('a')).toBeNull();
    expect(element.textContent).toContain('إدارة التطبيق');
  });
});
