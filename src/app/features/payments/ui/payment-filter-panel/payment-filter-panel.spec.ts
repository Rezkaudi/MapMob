import { TestBed } from '@angular/core/testing';
import { NO_PAYMENT_FILTERS, PaymentFilters } from '../../models/payment-filters';
import { PaymentFilterPanel } from './payment-filter-panel';

function render(filters: PaymentFilters = NO_PAYMENT_FILTERS) {
  const fixture = TestBed.createComponent(PaymentFilterPanel);
  fixture.componentRef.setInput('filters', filters);
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

function changeDay(element: HTMLElement, label: string, day: string): void {
  const input = element.querySelector(`input[aria-label="${label}"]`) as HTMLInputElement;
  input.value = day;
  input.dispatchEvent(new Event('change'));
}

describe('PaymentFilterPanel', () => {
  it('shows the heading, the company field, the two chip groups and the date range', () => {
    const element = render({
      ...NO_PAYMENT_FILTERS,
      companyName: 'صيدلية الحياة',
    }).nativeElement as HTMLElement;

    expect(element.textContent).toContain('تصفية المدفوعات');
    expect(element.textContent).toContain('المتجر / المكان');
    expect(element.textContent).toContain('طريقة الدفع');
    expect(element.textContent).toContain('العملة');
    expect(element.textContent).toContain('تاريخ الدفع');
    expect((element.querySelector('input[type="text"]') as HTMLInputElement).value).toBe(
      'صيدلية الحياة',
    );
  });

  it('applies only when asked, with everything picked in the panel', () => {
    const fixture = render();
    const applied = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('input[type="text"]') as HTMLInputElement).value = 'الحياة';
    (element.querySelector('input[type="text"]') as HTMLInputElement).dispatchEvent(
      new Event('input'),
    );
    fixture.detectChanges();
    buttonNamed(element, 'نقداً').click();
    fixture.detectChanges();
    buttonNamed(element, 'دولار').click();
    fixture.detectChanges();
    changeDay(element, 'من تاريخ', '2026-08-01');
    fixture.detectChanges();
    changeDay(element, 'إلى تاريخ', '2026-09-02');
    fixture.detectChanges();
    expect(applied).not.toHaveBeenCalled();

    buttonNamed(element, 'تطبيق الفلاتر').click();

    expect(applied).toHaveBeenCalledWith({
      companyName: 'الحياة',
      paymentMethod: 'cash',
      currency: 'USD',
      paidOn: { from: '2026-08-01', to: '2026-09-02' },
    });
  });

  it('will not apply a range that ends before it starts', () => {
    const fixture = render({
      ...NO_PAYMENT_FILTERS,
      paidOn: { from: '2026-09-10', to: '2026-09-01' },
    });

    expect(buttonNamed(fixture.nativeElement, 'تطبيق الفلاتر').disabled).toBe(true);
  });

  it('clears the company field from its own × button', () => {
    const fixture = render({ ...NO_PAYMENT_FILTERS, companyName: 'صيدلية الحياة' });
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('button[aria-label="مسح"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect((element.querySelector('input[type="text"]') as HTMLInputElement).value).toBe('');
  });

  it('resets to "الكل" and applies that straight away, and closes from the cross', () => {
    const fixture = render({ ...NO_PAYMENT_FILTERS, paymentMethod: 'cash' });
    const applied = vi.fn();
    const closed = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);
    fixture.componentInstance.closed.subscribe(closed);
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'إعادة ضبط').click();
    (element.querySelector('button[aria-label="إغلاق"]') as HTMLButtonElement).click();

    expect(applied).toHaveBeenCalledWith(NO_PAYMENT_FILTERS);
    expect(closed).toHaveBeenCalled();
  });
});
