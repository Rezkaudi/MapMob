import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { buildComplaintDetailView } from '../../state/complaint-detail-view';
import { buildComplaintDetail } from '../../testing/complaint-fixture';
import { ReportedPlaceCard } from './reported-place-card';

function render(imageUrl: string | null = 'assets/images/place-restaurant-hall.jpg') {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const complaint = buildComplaintDetail();
  const detail = { ...complaint, place: { ...complaint.place, imageUrl } };
  const fixture = TestBed.createComponent(ReportedPlaceCard);
  fixture.componentRef.setInput('place', detail.place);
  fixture.componentRef.setInput('view', buildComplaintDetailView(detail));
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('ReportedPlaceCard', () => {
  it('previews the place with its picture, category, address and rating', () => {
    const element = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('المحتوى المُبلّغ عنه');
    expect(element.querySelector('img')?.getAttribute('alt')).toBe('مطعم الشام');
    expect(element.querySelector('h3')?.textContent?.trim()).toBe('مطعم الشام');
    expect(element.textContent).toContain('مطاعم');
    expect(element.textContent).toContain('طرطوس،طرطوس المدينة');
    expect(element.querySelector('[data-role="rating"]')?.textContent?.trim()).toBe('4.6');
    expect(element.textContent).toContain('(120 تقييماً )');
  });

  it('keeps a grey block when the place has no picture', () => {
    const element = render(null);

    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('[data-role="image-placeholder"]')).toBeTruthy();
  });

  it('links to the place page', () => {
    const link = render().querySelector('a') as HTMLAnchorElement;

    expect(link.textContent?.trim()).toBe('معاينة صفحة المكان');
    expect(link.getAttribute('href')).toBe('/places/place-4');
  });
});
