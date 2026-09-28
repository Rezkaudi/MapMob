import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { MerchantProduct } from '../../models/merchant-product';
import { toProductTableRow } from '../../state/product-table-rows';
import { buildMerchantProduct } from '../../testing/merchant-product-fixture';
import { ProductTable } from './product-table';

const NOW = new Date('2026-09-28T12:00:00.000Z');
const CREAM = buildMerchantProduct({ id: '1' });
const SERUM = buildMerchantProduct({
  id: '2',
  name: 'سيروم',
  isAvailable: false,
  imageUrl: 'https://cdn.example.com/serum.png',
});

function build(selected: string[] = []) {
  const fixture = TestBed.createComponent(ProductTable);
  fixture.componentRef.setInput(
    'rows',
    [CREAM, SERUM].map((one) => toProductTableRow(one, NOW)),
  );
  fixture.componentRef.setInput('selectedIdSet', new Set(selected));
  fixture.detectChanges();
  return fixture;
}

function cellTexts(row: Element): string[] {
  return [...row.querySelectorAll('td')].map((cell) => cell.textContent?.trim() ?? '');
}

describe('ProductTable', () => {
  it('heads the columns right to left as the frame does', () => {
    const headers = [...build().nativeElement.querySelectorAll('th')].map((cell: Element) =>
      cell.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'الصورة',
      'اسم المنتج / الخدمة',
      'السعر',
      'آخر تحديث',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('prints each product: initial or picture, name, price, last change and status', () => {
    const rows = build().nativeElement.querySelectorAll('tbody tr');

    expect(cellTexts(rows[0]).slice(1, 6)).toEqual([
      'م',
      'مرطب dove',
      '200 ل.س',
      'منذ أسبوع',
      'متاح',
    ]);
    expect(rows[1].querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.example.com/serum.png',
    );
    expect(cellTexts(rows[1])[5]).toBe('غير متاح');
  });

  it('reports ticks on one row and on the header box', () => {
    const fixture = build(['2']);
    const toggled: string[] = [];
    let allToggles = 0;
    fixture.componentInstance.rowToggle.subscribe((id) => toggled.push(id));
    fixture.componentInstance.allToggle.subscribe(() => (allToggles += 1));
    const boxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');

    expect(boxes[2].checked).toBe(true);
    boxes[1].click();
    boxes[0].click();

    expect(toggled).toEqual(['1']);
    expect(allToggles).toBe(1);
  });

  it('offers only تعديل and حذف in the row menu and reports which product', () => {
    const fixture = build();
    const edited: MerchantProduct[] = [];
    const removed: MerchantProduct[] = [];
    fixture.componentInstance.edit.subscribe((product) => edited.push(product));
    fixture.componentInstance.remove.subscribe((product) => removed.push(product));

    const menus = fixture.debugElement.queryAll(By.directive(RowActionsMenu));
    const firstMenu = menus[0].componentInstance as RowActionsMenu;
    expect(firstMenu.isStatusChangeVisible()).toBe(false);
    firstMenu.edit.emit();
    (menus[1].componentInstance as RowActionsMenu).remove.emit();

    expect(edited).toEqual([CREAM]);
    expect(removed).toEqual([SERUM]);
  });

  it('shows the empty message in place of rows', () => {
    const fixture = TestBed.createComponent(ProductTable);
    fixture.componentRef.setInput('rows', []);
    fixture.componentRef.setInput('hasNoRows', true);
    fixture.componentRef.setInput('emptyMessage', 'لم تضف أي منتج أو خدمة بعد');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لم تضف أي منتج أو خدمة بعد');
  });

  it('lines each header up with the values under it, with no extra start padding', () => {
    const host: HTMLElement = build().nativeElement;
    const headers = [...host.querySelectorAll('th')];
    const firstRow = [...host.querySelectorAll('tbody tr:first-child td')];

    for (const column of [2, 3, 4]) {
      expect(headers[column].classList).toContain('text-center');
      expect(firstRow[column].classList).toContain('text-center');
      expect([...headers[column].classList].some((name) => name.startsWith('ps-'))).toBe(false);
    }
    for (const column of [1, 5]) {
      const headerBox = headers[column].firstElementChild as HTMLElement;
      const valueBox = firstRow[column].firstElementChild as HTMLElement;
      expect(headers[column].className).toBe(firstRow[column].className);
      expect(headerBox.classList).toContain('text-center');
      expect(widthClass(headerBox)).toBe(widthClass(valueBox));
    }
  });
});

function widthClass(element: HTMLElement): string | undefined {
  return [...element.classList].find((name) => /^(w|size)-/.test(name))?.replace(/^size-/, 'w-');
}
