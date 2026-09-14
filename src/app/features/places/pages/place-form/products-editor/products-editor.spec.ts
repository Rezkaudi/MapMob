import { TestBed } from '@angular/core/testing';
import { ProductsEditor } from './products-editor';
import { PlaceProduct } from '../../../models/place-product';

const PRODUCT: PlaceProduct = {
  id: 'p1',
  name: 'تنظيف بشرة عميق',
  price: 150,
  currency: 'ل.س',
  imageUrl: '',
  isAvailable: true,
  orderUrl: '',
};

function build(products: PlaceProduct[], limit = 3, packageLabel = 'مجانية') {
  const fixture = TestBed.createComponent(ProductsEditor);
  fixture.componentRef.setInput('products', products);
  fixture.componentRef.setInput('limit', limit);
  fixture.componentRef.setInput('packageLabel', packageLabel);
  fixture.detectChanges();
  return fixture;
}

describe('ProductsEditor', () => {
  it('shows the heading and the add action', () => {
    const text = build([PRODUCT]).nativeElement.textContent;

    expect(text).toContain('المنتجات والخدمات');
    expect(text).toContain('إضافة منتج أو خدمة');
  });

  it('counts the products against the package limit', () => {
    const text = build([PRODUCT]).nativeElement.textContent;

    expect(text).toContain('1 / 3 منتجات وخدمات');
    expect(text).toContain('الباقة الحالية:');
    expect(text).toContain('مجانية');
  });

  it('fills the progress bar by the share of the limit used', () => {
    const fixture = build([PRODUCT, { ...PRODUCT, id: 'p2' }], 4);
    const fill: HTMLElement = fixture.nativeElement.querySelector('[data-testid="quota-fill"]');

    expect(fill.style.width).toBe('50%');
  });

  it('never fills past the whole bar when the limit is exceeded', () => {
    const fixture = build([PRODUCT, { ...PRODUCT, id: 'p2' }], 1);
    const fill: HTMLElement = fixture.nativeElement.querySelector('[data-testid="quota-fill"]');

    expect(fill.style.width).toBe('100%');
  });

  it('lists each product with its price', () => {
    const rows = build([PRODUCT]).nativeElement.querySelectorAll('[data-testid="product-item"]');

    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('تنظيف بشرة عميق');
    expect(rows[0].textContent).toContain('150 ل.س');
  });

  it('emits add, edit and remove', () => {
    const fixture = build([PRODUCT]);
    const fired: string[] = [];
    fixture.componentInstance.addProduct.subscribe(() => fired.push('add'));
    fixture.componentInstance.editProduct.subscribe((product) => fired.push(`edit:${product.id}`));
    fixture.componentInstance.removeProduct.subscribe((product) =>
      fired.push(`remove:${product.id}`),
    );

    const click = (testId: string) =>
      (fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as HTMLElement).click();
    click('add-product');
    click('edit-product');
    click('remove-product');

    expect(fired).toEqual(['add', 'edit:p1', 'remove:p1']);
  });

  it('disables adding once the limit is reached', () => {
    const add: HTMLButtonElement = build([PRODUCT], 1).nativeElement.querySelector(
      '[data-testid="add-product"]',
    );

    expect(add.disabled).toBe(true);
  });

  it('invites a first product when none are added', () => {
    expect(build([]).nativeElement.textContent).toContain('لم تتم إضافة أي منتج أو خدمة بعد');
  });
});
