import { TestBed } from '@angular/core/testing';
import { Payment } from '../../models/payment';
import { buildPaymentDetail } from '../../testing/payment-fixture';
import { PaymentTable } from './payment-table';

const PHARMACY = buildPaymentDetail();
const RESTAURANT = buildPaymentDetail({
  id: 'payment-2',
  transactionNumber: '#pay-1032',
  companyName: 'مطعم الأصالة',
  currency: 'SYP',
  paymentMethod: 'other',
});

interface RenderOptions {
  readonly entries?: readonly Payment[];
  readonly isLoading?: boolean;
  readonly hasNoResults?: boolean;
}

function render(options: RenderOptions = {}) {
  const fixture = TestBed.createComponent(PaymentTable);
  fixture.componentRef.setInput('entries', options.entries ?? [PHARMACY, RESTAURANT]);
  fixture.componentRef.setInput('selectedIdSet', new Set(['payment-2']));
  fixture.componentRef.setInput('isLoading', options.isLoading ?? false);
  fixture.componentRef.setInput('hasNoResults', options.hasNoResults ?? false);
  fixture.componentRef.setInput('emptyMessage', 'لا توجد نتائج مطابقة للبحث أو الفلاتر');
  fixture.detectChanges();
  return fixture;
}

function cellsOf(row: Element): string[] {
  return Array.from(row.querySelectorAll('td'), (cell) => cell.textContent?.trim() ?? '');
}

describe('PaymentTable', () => {
  it('heads the columns in the design order', () => {
    const headers = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('th'),
      (header) => header.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'رقم العملية',
      'اسم الشركة /المتجر',
      'المبلغ والعملة',
      'تاريخ الدفع',
      'طريقة الدفع',
      'رقم الايصال',
      'ملاحظات',
    ]);
  });

  it('fills a row with the payment fields', () => {
    const [first] = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('tbody tr'),
    );

    const cells = cellsOf(first).slice(1);
    expect(cells[0]).toBe('#pay-1024');
    expect(cells[1]).toBe('صيدلية الحياة');
    expect(cells[2]).toBe('25.00USD');
    expect(cells[3]).toBe('١٢ يناير ٢٠٢٤');
    expect(cells[4]).toBe('نقداً');
    expect(cells[5]).toBe('INV-1024');
    expect(cells[6]).toBe('اشتراك مميز باقة سنوية');
  });

  it('marks the selected row and opens the detail from anywhere on the row', () => {
    const fixture = render();
    const view = vi.fn();
    fixture.componentInstance.view.subscribe(view);
    const element = fixture.nativeElement as HTMLElement;
    const rows = element.querySelectorAll('tbody tr');

    expect((rows[1].querySelector('input[type="checkbox"]') as HTMLInputElement).checked).toBe(
      true,
    );

    (rows[0] as HTMLElement).click();
    expect(view).toHaveBeenCalledWith(PHARMACY);
  });

  it('does not open the detail when the checkbox itself is clicked', () => {
    const fixture = render();
    const view = vi.fn();
    fixture.componentInstance.view.subscribe(view);
    const rowToggle = vi.fn();
    fixture.componentInstance.rowToggle.subscribe(rowToggle);

    (
      (fixture.nativeElement as HTMLElement).querySelector('tbody input') as HTMLInputElement
    ).dispatchEvent(new Event('change'));

    expect(rowToggle).toHaveBeenCalledWith('payment-1');
    expect(view).not.toHaveBeenCalled();
  });

  it('reports "select all"', () => {
    const fixture = render();
    const allToggle = vi.fn();
    fixture.componentInstance.allToggle.subscribe(allToggle);

    (
      (fixture.nativeElement as HTMLElement).querySelector('thead input') as HTMLInputElement
    ).dispatchEvent(new Event('change'));

    expect(allToggle).toHaveBeenCalledOnce();
  });

  it('shows skeleton rows while loading and the message when nothing matches', () => {
    const loading = render({ isLoading: true }).nativeElement as HTMLElement;
    const empty = render({ entries: [], hasNoResults: true }).nativeElement as HTMLElement;

    expect(loading.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
    expect(empty.textContent).toContain('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });
});
