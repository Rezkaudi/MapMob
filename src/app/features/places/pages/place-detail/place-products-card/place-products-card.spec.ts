import { TestBed } from '@angular/core/testing';
import { PlaceProductsCard } from './place-products-card';
import { PlaceProduct } from '../../../models/place-product';

const PRODUCTS: PlaceProduct[] = [
  {
    id: 'p1',
    name: 'سيروم تحت العين',
    price: 200,
    currency: 'SYP',
    imageUrl: 'https://example.com/serum.jpg',
    isAvailable: true,
    orderUrl: '',
  },
  {
    id: 'p2',
    name: 'كريم مرطب',
    price: 120,
    currency: 'SYP',
    imageUrl: '',
    isAvailable: false,
    orderUrl: '',
  },
];

function build(products: PlaceProduct[]) {
  const fixture = TestBed.createComponent(PlaceProductsCard);
  fixture.componentRef.setInput('products', products);
  fixture.detectChanges();
  return fixture;
}

describe('PlaceProductsCard', () => {
  it('shows the heading, subtitle and add action from the design', () => {
    const text = build(PRODUCTS).nativeElement.textContent;

    expect(text).toContain('المنتجات و الخدمات');
    expect(text).toContain('بعض من المنتجات والخدمات التي يقدمها المكان.');
    expect(text).toContain('إضافة منتج أو خدمة');
  });

  it('ticks every row from the header box, and clears it when one row is unticked', () => {
    const fixture = build(PRODUCTS);
    const element: HTMLElement = fixture.nativeElement;
    const selectAll = element.querySelector<HTMLInputElement>('thead input[type="checkbox"]')!;
    const rowBoxes = () =>
      Array.from(element.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]'));

    selectAll.click();
    fixture.detectChanges();
    expect(rowBoxes().map((box) => box.checked)).toEqual([true, true]);

    rowBoxes()[0].click();
    fixture.detectChanges();
    expect(selectAll.checked).toBe(false);
    expect(rowBoxes().map((box) => box.checked)).toEqual([false, true]);
  });

  it('renders every column header, the first one being the select-all box', () => {
    const cells: HTMLElement[] = Array.from(build(PRODUCTS).nativeElement.querySelectorAll('th'));
    const headers = cells.map((cell) => cell.textContent?.trim() ?? '');

    expect(cells[0].querySelector('input')?.getAttribute('aria-label')).toBe('تحديد كل المنتجات');
    expect(headers.slice(1)).toEqual(['الصورة', 'المنتج/الخدمة', 'السعر', 'الحالة', 'الإجراء']);
  });

  it('renders one row per product with its price and availability', () => {
    const rows = build(PRODUCTS).nativeElement.querySelectorAll('tbody tr');

    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('سيروم تحت العين');
    expect(rows[0].textContent).toContain('200 ل.س');
    expect(rows[0].textContent).toContain('متاح');
    expect(rows[1].textContent).toContain('غير متاح');
  });

  it('asks for a product when the header action is pressed', () => {
    const fixture = build(PRODUCTS);
    let asked = 0;
    fixture.componentInstance.addProduct.subscribe(() => (asked += 1));

    const add: HTMLButtonElement = Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('button'),
    ).find((button) => button.textContent?.includes('إضافة منتج أو خدمة'))!;
    add.click();

    expect(asked).toBe(1);
  });

  it('invites the first product when the list is empty', () => {
    expect(build([]).nativeElement.textContent).toContain('لا توجد منتجات أو خدمات مضافة');
  });

  it('offers the three row actions the design draws', () => {
    const fixture = build(PRODUCTS);
    (fixture.nativeElement.querySelector('button[aria-haspopup]') as HTMLElement).click();
    fixture.detectChanges();

    const panel: HTMLElement = fixture.nativeElement.querySelector(
      '[data-testid="action-menu-panel"]',
    );
    const labels = Array.from(panel.querySelectorAll('button'), (b) => b.textContent?.trim());

    expect(labels).toEqual(['تعديل', 'تغيير الحالة', 'حذف']);
    expect(panel.querySelector('[data-testid="menu-divider"]')).toBeTruthy();
  });

  it('emits the row action for its own product', () => {
    const fixture = build(PRODUCTS);
    const fired: string[] = [];
    fixture.componentInstance.changeStatus.subscribe((p) => fired.push(`status:${p.id}`));
    (fixture.nativeElement.querySelector('button[aria-haspopup]') as HTMLElement).click();
    fixture.detectChanges();

    const panel: HTMLElement = fixture.nativeElement.querySelector(
      '[data-testid="action-menu-panel"]',
    );
    Array.from(panel.querySelectorAll('button'))
      .find((b) => b.textContent?.includes('تغيير الحالة'))!
      .click();

    expect(fired).toEqual(['status:p1']);
  });
});

describe('PlaceProductsCard name', () => {
  it('opens the product to edit when its name is clicked', () => {
    const fixture = build(PRODUCTS);
    const edited: string[] = [];
    fixture.componentInstance.editProduct.subscribe((product) => edited.push(product.id));

    const names = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '[data-role="open-product"]',
    );
    names[1].click();

    expect(edited).toEqual(['p2']);
  });
});
