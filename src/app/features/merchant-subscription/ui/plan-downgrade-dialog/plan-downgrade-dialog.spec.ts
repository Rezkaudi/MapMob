import { TestBed } from '@angular/core/testing';
import { buildDowngradeView } from '../../state/plan-downgrade-view';
import { FREE_PLAN, buildOverview } from '../../testing/merchant-subscription-fixture';
import { PlanDowngradeDialog } from './plan-downgrade-dialog';

function render() {
  const fixture = TestBed.createComponent(PlanDowngradeDialog);
  const noAds = { ...FREE_PLAN, limits: { ...FREE_PLAN.limits, adsPerMonth: 0 } };
  fixture.componentRef.setInput('downgrade', buildDowngradeView(buildOverview(), noAds, 'monthly'));
  fixture.detectChanges();
  return fixture;
}

describe('PlanDowngradeDialog', () => {
  it('titles the dialog with the target plan and explains the move', () => {
    const element: HTMLElement = render().nativeElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('الانتقال إلى الباقة المجانية');
    expect(element.querySelector('header p')?.textContent).toContain('أنت على وشك الانتقال');
  });

  it('puts the current plan first, so RTL shows it on the right', () => {
    const columns = render().nativeElement.querySelectorAll('[data-role="plan-column"]');

    expect(columns[0].textContent).toContain('الباقة الحالية');
    expect(columns[1].textContent).toContain('الباقة الجديدة');
    expect(columns[1].querySelectorAll('dd')[3].textContent.trim()).toBe('0 (غير متاحة)');
    expect(columns[1].querySelectorAll('dd')[3].className).toContain('text-[#94A3B8]');
  });

  it('warns about what the place loses', () => {
    expect(render().nativeElement.querySelector('[role="alert"]')?.textContent).toContain('تنبيه:');
  });

  it('confirms the move from the left button', () => {
    const fixture = render();
    const submitted = vi.fn();
    fixture.componentInstance.submitted.subscribe(submitted);
    const [cancel, confirm] = fixture.nativeElement.querySelectorAll('footer button');

    expect(cancel.textContent.trim()).toBe('إلغاء');
    expect(confirm.textContent.trim()).toBe('تأكيد الانتقال إلى الباقة المجانية');
    confirm.click();

    expect(submitted).toHaveBeenCalledOnce();
  });
});
