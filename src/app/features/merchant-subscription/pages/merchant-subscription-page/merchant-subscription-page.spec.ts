import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { MerchantSubscriptionRepository } from '../../data/merchant-subscription.repository';
import { MerchantSubscriptionOverview } from '../../models/merchant-subscription-overview';
import { PlanChangeDraft } from '../../models/plan-change-draft';
import { PlanChangeRequest } from '../../models/plan-change-request';
import { buildOverview } from '../../testing/merchant-subscription-fixture';
import { MerchantSubscriptionPage } from './merchant-subscription-page';

class FakeRepository extends MerchantSubscriptionRepository {
  failure: Error | null = null;

  getOverview(): Observable<MerchantSubscriptionOverview> {
    return this.failure ? throwError(() => this.failure) : of(buildOverview());
  }
  requestPlanChange(draft: PlanChangeDraft): Observable<PlanChangeRequest> {
    return of({
      id: 'request-1',
      kind: draft.kind,
      plan: { id: draft.planId, name: 'الباقة المميزة' },
      term: draft.term,
      status: 'pending',
      createdAt: '2026-09-10T09:00:00Z',
    });
  }
}

function render(configure: (repository: FakeRepository) => void = () => {}) {
  const repository = new FakeRepository();
  configure(repository);
  TestBed.configureTestingModule({
    providers: [
      { provide: MerchantSubscriptionRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date('2026-09-10T09:00:00') },
    ],
  });
  const fixture = TestBed.createComponent(MerchantSubscriptionPage);
  fixture.detectChanges();
  return fixture;
}

function click(fixture: ReturnType<typeof render>, selector: string): void {
  (fixture.nativeElement.querySelector(selector) as HTMLButtonElement).click();
  fixture.detectChanges();
}

describe('MerchantSubscriptionPage', () => {
  it('shows the header and the four sections in the frame order', () => {
    const element: HTMLElement = render().nativeElement;

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('الاشتراكات و الباقات');
    expect(element.querySelector('app-subscription-hero-card')).toBeTruthy();
    expect(element.querySelectorAll('app-usage-card')).toHaveLength(4);
    expect(element.querySelectorAll('app-plan-offer-card')).toHaveLength(3);
    expect(element.querySelectorAll('app-subscription-history-table tbody tr')).toHaveLength(2);
    expect(
      Array.from(element.querySelectorAll('app-section-heading h2'), (heading) =>
        heading.textContent?.trim(),
      ),
    ).toEqual(['استخدام الباقة', 'الباقات المتاحة', 'سجل الاشتراكات']);
  });

  it('says "وفر 20%" on the cycle switch and reprices the plans', () => {
    const fixture = render();
    const toggle: HTMLElement = fixture.nativeElement.querySelector('app-billing-cycle-toggle');
    expect(toggle.textContent).toContain('وفر 20%');

    (toggle.querySelectorAll('button')[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('app-plan-offer-card [data-role="period"]').textContent,
    ).toContain('سنوياً');
  });

  it('opens the details from the hero and closes them', () => {
    const fixture = render();

    click(fixture, 'app-subscription-hero-card [data-role="details"]');
    expect(fixture.nativeElement.querySelector('app-subscription-details-dialog')).toBeTruthy();

    click(fixture, 'app-subscription-details-dialog button[aria-label="إغلاق النافذة"]');
    expect(fixture.nativeElement.querySelector('app-subscription-details-dialog')).toBeNull();
  });

  it('sends an upgrade from the hero and thanks the merchant', async () => {
    const fixture = render();

    click(fixture, 'app-subscription-hero-card [data-role="upgrade"]');
    click(fixture, 'app-plan-request-dialog footer button:last-child');
    // The send resolves on a later task than the click.
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-plan-request-dialog')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-toast')?.textContent).toContain(
      'تم إرسال الطلب',
    );
  });

  it('opens the move dialog from the free plan card', () => {
    const fixture = render();

    click(fixture, 'app-plan-offer-card [data-role="plan-action"]');

    expect(fixture.nativeElement.querySelector('app-plan-downgrade-dialog')).toBeTruthy();
  });

  it('shows the error state when the page cannot load', () => {
    const element: HTMLElement = render((repository) => {
      repository.failure = new Error('انقطع الاتصال');
    }).nativeElement;

    expect(element.querySelector('app-error-state')?.textContent).toContain('انقطع الاتصال');
    expect(element.querySelector('app-subscription-hero-card')).toBeNull();
  });
});
