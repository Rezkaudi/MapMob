import { TestBed } from '@angular/core/testing';
import { buildPaymentDetail } from '../../testing/payment-fixture';
import { PaymentDetailDialog } from './payment-detail-dialog';

const DETAIL = buildPaymentDetail({
  transactionNumber: '#PAY-10254',
  receiptNumber: 'INV-10254',
  amount: 25,
  currency: 'USD',
  paymentMethod: 'cash',
  paidAt: '2026-09-07',
  notes: 'تم تسجيل الدفعة يدوياً بعد استلام التحويل البنكي لحساب المنصة.',
  company: {
    name: 'صيدلية الحياة',
    type: 'صيدلية',
    contactName: 'أحمد محمد',
    contactPhone: '+963 944 123 456',
  },
  subscription: {
    planName: 'الباقة الأساسية',
    cycle: 'شهري',
    startsOn: '2026-09-01',
    endsOn: '2026-10-01',
  },
});

function render(overrides: {
  detail?: typeof DETAIL | null;
  isLoading?: boolean;
  error?: string | null;
} = {}) {
  const fixture = TestBed.createComponent(PaymentDetailDialog);
  fixture.componentRef.setInput('detail', 'detail' in overrides ? overrides.detail : DETAIL);
  fixture.componentRef.setInput('isLoading', overrides.isLoading ?? false);
  fixture.componentRef.setInput('error', overrides.error ?? null);
  fixture.detectChanges();
  return fixture;
}

describe('PaymentDetailDialog', () => {
  it('shows the title, the tag and the top summary', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.textContent).toContain('تفاصيل الدفعة');
    expect(element.textContent).toContain('#PAY-10254');
    expect(element.textContent).toContain('25.00 USD');
    expect(element.textContent).toContain('نقداً');
    expect(element.textContent).toContain('07/09/2026');
  });

  it('shows the payment info, the company and the linked subscription', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.textContent).toContain('معلومات الدفعة');
    expect(element.textContent).toContain('INV-10254');
    expect(element.textContent).toContain('USD — دولار أمريكي');
    expect(element.textContent).toContain('الشركة / المتجر');
    expect(element.textContent).toContain('صيدلية الحياة');
    expect(element.textContent).toContain('أحمد محمد');
    expect(element.textContent).toContain('+963 944 123 456');
    expect(element.textContent).toContain('الاشتراك المرتبط');
    expect(element.textContent).toContain('الباقة الأساسية');
    expect(element.textContent).toContain('شهري');
    expect(element.textContent).toContain('01/10/2026');
    expect(element.textContent).toContain('01/09/2026');
    expect(element.textContent).toContain('الملاحظات');
    expect(element.textContent).toContain('تم تسجيل الدفعة يدوياً');
  });

  it('leaves the subscription section out when the payment has none', () => {
    const element = render({ detail: { ...DETAIL, subscription: null } }).nativeElement as HTMLElement;

    expect(element.textContent).not.toContain('تاريخ بداية الاشتراك');
  });

  it('closes from the cross and from outside the card, but not from inside it', () => {
    const fixture = render();
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('[role="dialog"] > div') as HTMLElement).click();
    expect(closed).not.toHaveBeenCalled();

    (element.querySelector('button[aria-label="إغلاق النافذة"]') as HTMLButtonElement).click();
    expect(closed).toHaveBeenCalledTimes(1);

    (element.querySelector('[role="dialog"]') as HTMLElement).click();
    expect(closed).toHaveBeenCalledTimes(2);
  });

  it('shows the error state with a retry, and skeletons while loading', () => {
    const failed = render({ detail: null, error: 'تعذر تحميل الدفعة' });
    const retry = vi.fn();
    failed.componentInstance.retry.subscribe(retry);
    (failed.nativeElement.querySelector('button[aria-label]:not([aria-label="إغلاق النافذة"])') ??
      failed.nativeElement.querySelector('app-error-state button')) as HTMLButtonElement;
    expect(failed.nativeElement.textContent).toContain('تعذر تحميل الدفعة');

    const loading = render({ detail: null, isLoading: true });
    expect(loading.nativeElement.querySelector('app-skeleton')).toBeTruthy();
  });
});
