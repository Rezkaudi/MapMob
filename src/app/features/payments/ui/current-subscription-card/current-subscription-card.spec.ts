import { TestBed } from '@angular/core/testing';
import { CurrentSubscriptionCard } from './current-subscription-card';

function render() {
  const fixture = TestBed.createComponent(CurrentSubscriptionCard);
  fixture.componentRef.setInput('planName', 'الباقة الأساسية');
  fixture.componentRef.setInput('endsOn', '2026-08-17');
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('CurrentSubscriptionCard', () => {
  it('names the running plan beside its heading', () => {
    const [heading, plan] = Array.from(render().querySelectorAll('[data-role="plan-row"] span'));

    expect(heading.textContent?.trim()).toBe('بيانات الاشتراك الحالي:');
    expect(plan.textContent?.trim()).toBe('الباقة الأساسية');
  });

  it('writes the end day the way the design does', () => {
    const [label, day] = Array.from(render().querySelectorAll('[data-role="ends-row"] span'));

    expect(label.textContent?.trim()).toBe('تاريخ انتهاء الاشتراك الحالي');
    expect(day.textContent?.trim()).toBe('17/08/2026');
  });
});
