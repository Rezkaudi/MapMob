import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { MerchantOverviewRepository } from '../../data/merchant-overview.repository';
import {
  MERCHANT_OVERVIEW_SEED,
  buildStorePerformanceSeed,
} from '../../data/merchant-overview-mock-seed';
import { MerchantHome } from './merchant-home';

function render(repository: Partial<MerchantOverviewRepository>) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: MerchantOverviewRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date('2026-07-26T12:00:00Z') },
    ],
  });
  const fixture = TestBed.createComponent(MerchantHome);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const WORKING_REPOSITORY: Partial<MerchantOverviewRepository> = {
  getOverview: () => of(MERCHANT_OVERVIEW_SEED),
  getPerformance: (period) => of(buildStorePerformanceSeed(period)),
};

describe('MerchantHome', () => {
  it('titles the page and greets the store by name', () => {
    const element = render(WORKING_REPOSITORY);

    expect(element.querySelector('h1')!.textContent!.trim()).toBe('الرئيسية');
    expect(element.textContent).toContain(
      'مرحباً مطعم الروابي،إليك ملخص أداء متجرك و آخر التحديثات.',
    );
  });

  it('shows the four cards, views first so RTL puts them on the right', () => {
    const element = render(WORKING_REPOSITORY);

    const cards = [...element.querySelectorAll('app-stat-card')];
    expect(cards.length).toBe(4);
    expect(cards[0].textContent).toContain('مشاهدات متجرك');
    expect(cards[0].textContent).toContain('2300');
    expect(cards[3].textContent).toContain('متوسط التقييم');
  });

  it('introduces the quick actions and lists all four', () => {
    const element = render(WORKING_REPOSITORY);

    expect(element.textContent).toContain('إجراءات سريعة');
    expect(element.textContent).toContain(
      'أنجز المهام الأكثر استخداماً وإدارة متجرك مباشرة من هنا',
    );
    expect(element.querySelectorAll('app-quick-action-card').length).toBe(4);
  });

  it('puts the chart before the activity list, and the package before the reviews', () => {
    const element = render(WORKING_REPOSITORY);

    const order = [
      ...element.querySelectorAll(
        'app-store-performance-card, app-recent-activity-card, app-subscription-card, app-latest-reviews-card',
      ),
    ].map((card) => card.tagName);
    expect(order).toEqual([
      'APP-STORE-PERFORMANCE-CARD',
      'APP-RECENT-ACTIVITY-CARD',
      'APP-SUBSCRIPTION-CARD',
      'APP-LATEST-REVIEWS-CARD',
    ]);
  });

  it('offers a retry when the overview cannot load', () => {
    const element = render({
      getOverview: () => throwError(() => new Error('تعذر تحميل البيانات')),
      getPerformance: () => of(buildStorePerformanceSeed('monthly')),
    });

    expect(element.querySelector('app-error-state')!.textContent).toContain('تعذر تحميل البيانات');
    expect(element.querySelector('app-stat-card')).toBeNull();
  });
});
