import { TestBed } from '@angular/core/testing';
import { buildSubscriptionDetails } from '../../state/subscription-details';
import { CURRENT_RECORD, buildOverview } from '../../testing/merchant-subscription-fixture';
import { SubscriptionDetailsDialog } from './subscription-details-dialog';

function render() {
  const fixture = TestBed.createComponent(SubscriptionDetailsDialog);
  fixture.componentRef.setInput(
    'details',
    buildSubscriptionDetails(CURRENT_RECORD, buildOverview().plans),
  );
  fixture.detectChanges();
  return fixture;
}

describe('SubscriptionDetailsDialog', () => {
  it('titles the slim dialog and leaves the footer out', () => {
    const element: HTMLElement = render().nativeElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تفاصيل الاشتراك');
    expect(element.querySelector('footer')).toBeNull();
  });

  it('shows the plan with its status, then the tiles right to left', () => {
    const element: HTMLElement = render().nativeElement;
    const labels = Array.from(element.querySelectorAll('dt'), (term) => term.textContent?.trim());

    expect(element.querySelector('[data-role="plan-name"]')?.textContent?.trim()).toBe(
      'الباقة الأساسية',
    );
    expect(element.querySelector('app-subscription-status-badge')?.textContent).toContain('نشطة');
    expect(labels).toEqual([
      'الباقة المشترك بها',
      'تاريخ بداية الاشتراك',
      'تاريخ نهاية الاشتراك',
      'المبلغ المدفوع',
      'المدة',
      'طريقة الدفع',
    ]);
  });

  it('lists the plan features', () => {
    expect(render().nativeElement.querySelectorAll('app-plan-feature-list li')).toHaveLength(2);
  });

  it('closes from the cross', () => {
    const fixture = render();
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);

    fixture.nativeElement.querySelector('button[aria-label="إغلاق النافذة"]').click();

    expect(closed).toHaveBeenCalledOnce();
  });
});
