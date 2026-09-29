import { TestBed } from '@angular/core/testing';
import { DeliveryPlatformEntry } from '../../models/delivery-platform-entry';
import { buildDeliveryPlatform } from '../../testing/delivery-platform-fixture';
import { DeliveryPlatformTable } from './delivery-platform-table';

const TALABAT = buildDeliveryPlatform();
const FOODZONE = buildDeliveryPlatform({
  id: 'platform-7',
  name: 'فود زون',
  latinName: 'FoodZone',
  linkedStoreCount: 1,
  status: 'suspended',
});

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(DeliveryPlatformTable);
  fixture.componentRef.setInput('entries', [TALABAT, FOODZONE]);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

function rowsOf(element: HTMLElement): HTMLTableRowElement[] {
  return Array.from(element.querySelectorAll('tbody tr'));
}

function cellTexts(row: HTMLTableRowElement): string[] {
  return Array.from(row.querySelectorAll('td'), (cell) => cell.textContent?.trim() ?? '');
}

function pickFromMenu(fixture: ReturnType<typeof render>, label: string): void {
  const element = fixture.nativeElement as HTMLElement;
  (element.querySelector('button[aria-haspopup]') as HTMLButtonElement).click();
  fixture.detectChanges();
  const item = Array.from(
    element.querySelectorAll('[data-testid="action-menu-panel"] button'),
  ).find((button) => button.textContent?.trim() === label) as HTMLButtonElement;
  item.click();
}

describe('DeliveryPlatformTable', () => {
  it('draws the frame headers', () => {
    const headers = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('th'),
      (cell) => cell.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'المنصة',
      'عدد المتاجر المرتبطة',
      'رابط المنصة العامة',
      'التحويلات',
      'تاريخ الإضافة',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('fills each row from its platform', () => {
    const [talabat, foodzone] = rowsOf(render().nativeElement);

    expect(cellTexts(talabat).slice(1, 7)).toEqual([
      'T talabat',
      '124 متجر',
      'https://www.talabat.com',
      '1,200',
      '٢٦ يناير ٢٠٢٤',
      'نشط',
    ]);
    expect(cellTexts(foodzone)[2]).toBe('متجر واحد');
    expect(cellTexts(foodzone)[6]).toBe('معطل');
  });

  it('keeps the Latin link left to right and opens it in a new tab', () => {
    const link = rowsOf(render().nativeElement)[0].querySelector('a') as HTMLAnchorElement;

    expect(link.getAttribute('dir')).toBe('ltr');
    expect(link.href).toBe('https://www.talabat.com/');
    expect(link.target).toBe('_blank');
  });

  it('reports ticks on a row and on the header box', () => {
    const fixture = render({ selectedIdSet: new Set(['platform-1']) });
    const toggled: string[] = [];
    let allToggleCount = 0;
    fixture.componentInstance.rowToggle.subscribe((id) => toggled.push(id));
    fixture.componentInstance.allToggle.subscribe(() => allToggleCount++);
    const boxes = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    );

    expect(boxes[1].checked).toBe(true);
    boxes[2].click();
    boxes[0].click();

    expect(toggled).toEqual(['platform-7']);
    expect(allToggleCount).toBe(1);
  });

  it('offers edit, linked stores, status and delete from the row menu', () => {
    const fixture = render();
    const picked: [string, DeliveryPlatformEntry][] = [];
    fixture.componentInstance.edit.subscribe((entry) => picked.push(['edit', entry]));
    fixture.componentInstance.viewStores.subscribe((entry) => picked.push(['stores', entry]));
    fixture.componentInstance.statusChange.subscribe((entry) => picked.push(['status', entry]));
    fixture.componentInstance.remove.subscribe((entry) => picked.push(['remove', entry]));

    pickFromMenu(fixture, 'تعديل');
    pickFromMenu(fixture, 'عرض المتاجر المرتبطة');
    pickFromMenu(fixture, 'تغيير الحالة');
    pickFromMenu(fixture, 'حذف');

    expect(picked.map(([action]) => action)).toEqual(['edit', 'stores', 'status', 'remove']);
    expect(picked.every(([, entry]) => entry === TALABAT)).toBe(true);
  });

  it('opens the linked stores from the platform name only', () => {
    const fixture = render();
    const viewed: DeliveryPlatformEntry[] = [];
    fixture.componentInstance.viewStores.subscribe((entry) => viewed.push(entry));
    const [talabat, foodzone] = rowsOf(fixture.nativeElement);

    expect(talabat.getAttribute('role')).toBeNull();
    (talabat.querySelectorAll('td')[4] as HTMLElement).click();
    expect(viewed).toEqual([]);

    const name = foodzone.querySelector('[data-role="open-platform"]') as HTMLButtonElement;
    expect(name.tagName).toBe('BUTTON');
    expect(name.textContent?.trim()).toBe('FoodZone');
    expect(name.hasAttribute('title')).toBe(false);
    name.click();

    expect(viewed).toEqual([FOODZONE]);
  });

  it('shows skeleton rows while loading', () => {
    const element = render({ isLoading: true, rowCount: 4 }).nativeElement as HTMLElement;

    expect(element.querySelector('tbody[app-table-skeleton]')).not.toBeNull();
  });

  it('shows the empty message when nothing matches', () => {
    const element = render({
      entries: [],
      hasNoResults: true,
      emptyMessage: 'لا توجد نتائج مطابقة لبحثك',
    }).nativeElement as HTMLElement;

    expect(element.querySelector('app-table-empty')?.textContent).toContain(
      'لا توجد نتائج مطابقة لبحثك',
    );
  });
});
