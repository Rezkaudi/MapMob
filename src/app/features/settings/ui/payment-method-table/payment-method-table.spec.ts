import { TestBed } from '@angular/core/testing';
import { PaymentMethod } from '../../models/payment-method';
import { buildPaymentMethod } from '../../testing/settings-fixture';
import { PaymentMethodTable } from './payment-method-table';

function render(methods: readonly PaymentMethod[], isLoading = false) {
  const fixture = TestBed.createComponent(PaymentMethodTable);
  fixture.componentRef.setInput('methods', methods);
  fixture.componentRef.setInput('isLoading', isLoading);
  const edited: PaymentMethod[] = [];
  fixture.componentInstance.edit.subscribe((method) => edited.push(method));
  fixture.detectChanges();
  return { element: fixture.nativeElement as HTMLElement, edited };
}

const cellTexts = (row: Element) =>
  Array.from(row.children).map((cell) => cell.textContent?.trim());

describe('PaymentMethodTable', () => {
  it('heads the columns right to left as the design does', () => {
    const { element } = render([]);

    expect(cellTexts(element.querySelector('thead tr') as Element)).toEqual([
      'وسيلة الدفع',
      'النوع',
      'الحالة',
      'اجراءات',
    ]);
  });

  it('writes each method with its type word and status pill', () => {
    const { element } = render([
      buildPaymentMethod(),
      buildPaymentMethod({
        id: 'payment-method-2',
        name: 'تحويل بنكي',
        kind: 'electronic',
        status: 'suspended',
      }),
    ]);

    const rows = element.querySelectorAll('tbody tr');
    expect(cellTexts(rows[0]).slice(0, 3)).toEqual(['دفع نقدي', 'يدوي', 'نشط']);
    expect(cellTexts(rows[1]).slice(0, 3)).toEqual(['تحويل بنكي', 'إلكتروني', 'معطل']);
  });

  it('asks to edit a method from its pencil', () => {
    const method = buildPaymentMethod();
    const { element, edited } = render([method]);

    (element.querySelector('button[aria-label="تعديل دفع نقدي"]') as HTMLButtonElement).click();

    expect(edited).toEqual([method]);
  });

  it('says when there are no methods', () => {
    expect(render([]).element.textContent).toContain('لا توجد وسائل دفع بعد');
  });

  it('shows placeholder rows while loading', () => {
    const { element } = render([], true);

    expect(element.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
    expect(element.textContent).not.toContain('لا توجد وسائل دفع بعد');
  });
});
