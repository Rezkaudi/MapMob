import { TestBed } from '@angular/core/testing';
import { buildUpgradeRequest } from '../../state/plan-request-view';
import { FEATURED_PLAN, buildOverview } from '../../testing/merchant-subscription-fixture';
import { PlanRequestDialog } from './plan-request-dialog';

function render(isBusy = false) {
  const fixture = TestBed.createComponent(PlanRequestDialog);
  fixture.componentRef.setInput(
    'request',
    buildUpgradeRequest(buildOverview(), FEATURED_PLAN, 'monthly'),
  );
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  return fixture;
}

describe('PlanRequestDialog', () => {
  it('sums up the request, label first so RTL puts it on the right', () => {
    const element: HTMLElement = render().nativeElement;
    const rows = element.querySelectorAll('[data-role="summary-row"]');

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('طلب ترقية الباقة');
    expect(rows).toHaveLength(4);
    expect(rows[1].children[0].textContent?.trim()).toBe('الباقة الجديدة المطلوبة');
    expect(rows[1].children[1].textContent?.trim()).toBe('الباقة المميزة');
    expect(rows[1].children[1].className).toContain('text-primary');
  });

  it('explains how MapMob reviews the request', () => {
    expect(render().nativeElement.textContent).toContain('آلية التفعيل و مراجعة الطلب :');
  });

  it('puts cancel on the right and send on the left, and reports each', () => {
    const fixture = render();
    const [cancel, send] = fixture.nativeElement.querySelectorAll('footer button');
    const submitted = vi.fn();
    const closed = vi.fn();
    fixture.componentInstance.submitted.subscribe(submitted);
    fixture.componentInstance.closed.subscribe(closed);

    expect(cancel.textContent.trim()).toBe('إلغاء');
    expect(send.textContent.trim()).toBe('إرسال الطلب');
    send.click();
    cancel.click();

    expect(submitted).toHaveBeenCalledOnce();
    expect(closed).toHaveBeenCalledOnce();
  });

  it('locks sending while the request is on its way', () => {
    const [, send] = render(true).nativeElement.querySelectorAll('footer button');

    expect(send.disabled).toBe(true);
  });
});
