import { TestBed } from '@angular/core/testing';
import { ProductDialog } from './product-dialog';
import { ProductDraft } from '../../models/product-draft';

function build() {
  const fixture = TestBed.createComponent(ProductDialog);
  fixture.detectChanges();
  return fixture;
}

function typeInto(fixture: ReturnType<typeof build>, testId: string, value: string) {
  const field: HTMLInputElement = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  field.value = value;
  field.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

describe('ProductDialog', () => {
  it('shows the heading, subtitle and every field label from the design', () => {
    const text = build().nativeElement.textContent;

    expect(text).toContain('إضافة منتج أو خدمة');
    expect(text).toContain('أضف بيانات المنتج أو الخدمة ليظهر ضمن صفحة المكان.');
    expect(text).toContain('الصورة');
    expect(text).toContain('اسم المنتج أو الخدمة');
    expect(text).toContain('السعر');
    expect(text).toContain('رابط الطلب');
    expect(text).toContain('يستخدم لنقل المستخدم إلى منصة أو تطبيق الطلب الخارجي.');
  });

  it('keeps the submit button disabled until a name and a price are given', () => {
    const fixture = build();
    const submit: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="submit-product"]',
    );
    expect(submit.disabled).toBe(true);

    typeInto(fixture, 'product-name', 'تنظيف بشرة عميق');
    expect(submit.disabled).toBe(true);

    typeInto(fixture, 'product-price', '150');
    expect(submit.disabled).toBe(false);
  });

  it('emits the draft it collected', () => {
    const fixture = build();
    const drafts: ProductDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => drafts.push(draft));

    typeInto(fixture, 'product-name', 'سيروم تحت العين');
    typeInto(fixture, 'product-price', '200');
    typeInto(fixture, 'product-order-url', 'https://shop.example.com/serum');
    fixture.nativeElement.querySelector('[data-testid="submit-product"]').click();

    expect(drafts).toEqual([
      {
        name: 'سيروم تحت العين',
        price: 200,
        imageUrl: '',
        orderUrl: 'https://shop.example.com/serum',
      },
    ]);
  });

  it('cancels from both the footer button and the close icon', () => {
    const fixture = build();
    let cancels = 0;
    fixture.componentInstance.cancelled.subscribe(() => (cancels += 1));

    fixture.nativeElement.querySelector('[data-testid="cancel-product"]').click();
    fixture.nativeElement.querySelector('[data-testid="close-product-dialog"]').click();

    expect(cancels).toBe(2);
  });
});
