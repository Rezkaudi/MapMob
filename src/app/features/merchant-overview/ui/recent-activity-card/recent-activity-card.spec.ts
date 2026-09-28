import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MerchantActivityRow } from '../../models/merchant-activity-row';
import { MERCHANT_ACTIVITY_SKINS } from '../../state/merchant-activity-skins';
import { RecentActivityCard } from './recent-activity-card';

const ROWS: readonly MerchantActivityRow[] = [
  {
    id: 'a-1',
    kind: 'review',
    message: 'تم تسجيل 3 تقييمات ممتازة لمتجرك',
    occurredAt: '2026-07-26T09:00:00Z',
    skin: MERCHANT_ACTIVITY_SKINS.review,
  },
  {
    id: 'a-2',
    kind: 'offer',
    message: 'عرضك الترويجي حقق 100 مشاهدة جديدة',
    occurredAt: '2026-07-25T09:00:00Z',
    skin: MERCHANT_ACTIVITY_SKINS.offer,
  },
];

function render(rows: readonly MerchantActivityRow[], isLoading = false) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(RecentActivityCard);
  fixture.componentRef.setInput('rows', rows);
  fixture.componentRef.setInput('isLoading', isLoading);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('RecentActivityCard', () => {
  it('titles the card and links "عرض الكل" to the notifications', () => {
    const element = render(ROWS);

    expect(element.querySelector('h2')!.textContent!.trim()).toBe('أحدث التفاعلات والتنبيهات');
    expect(element.querySelector('a')!.getAttribute('href')).toBe('/merchant/notifications');
  });

  it('draws one tinted row per activity, tile first so RTL puts it on the right', () => {
    const element = render(ROWS);

    const items = [...element.querySelectorAll('li')];
    expect(items.length).toBe(2);
    expect(items[1].classList).toContain('bg-[#2291ee]/20');
    expect(items[1].children[0].classList).toContain('bg-[#2291ee]');
    expect(items[1].children[1].textContent!.trim()).toBe('عرضك الترويجي حقق 100 مشاهدة جديدة');
  });

  it('says so when there is nothing new', () => {
    const element = render([]);

    expect(element.textContent).toContain('لا توجد تفاعلات جديدة');
  });

  it('shows placeholders while loading', () => {
    const element = render([], true);

    expect(element.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
    expect(element.textContent).not.toContain('لا توجد تفاعلات جديدة');
  });
});
