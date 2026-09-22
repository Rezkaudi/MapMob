import { TestBed } from '@angular/core/testing';
import { buildCategory } from '../../testing/category-fixture';
import { CategoryTable } from './category-table';

const RESTAURANTS = buildCategory({ id: 'm1', name: 'مطاعم', placeCount: 50 });
const SEAFOOD = buildCategory({
  id: 's1',
  name: 'مطاعم بحرية',
  kind: 'sub',
  parentId: 'm1',
  parentName: 'مطاعم',
  icon: 'coffee',
  color: '#0583EC',
  status: 'suspended',
});

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(CategoryTable);
  fixture.componentRef.setInput('entries', [RESTAURANTS, SEAFOOD]);
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

describe('CategoryTable', () => {
  it('draws the design headers', () => {
    const headers = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('th'),
      (cell) => cell.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'التصنيف',
      'النوع',
      'التصنيف ارئيسي',
      'عدد الأماكن',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('spreads the columns over the full width in the design proportions', () => {
    const widths = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('col'),
      (column) => column.style.width,
    );

    expect(widths).toEqual(['7.65%', '16.25%', '15.77%', '13.38%', '16.73%', '13.86%', '16.36%']);
    expect(widths.reduce((total, width) => total + parseFloat(width), 0)).toBeCloseTo(100);
  });

  it('draws a main category with a dash for its parent', () => {
    const [first] = rowsOf(render().nativeElement);

    expect(cellTexts(first).slice(1, 6)).toEqual(['مطاعم', 'رئيسي', '_', '50', 'نشط']);
  });

  it('draws a sub category with its parent, icon and status', () => {
    const second = rowsOf(render().nativeElement)[1];

    expect(cellTexts(second).slice(1, 6)).toEqual(['مطاعم بحرية', 'فرعي', 'مطاعم', '50', 'معطل']);
    const icon = second.querySelector('[data-testid="category-icon"]') as SVGElement;
    expect(icon.getAttribute('data-icon')).toBe('coffee');
    expect(icon.style.color).toBe('rgb(5, 131, 236)');
  });

  it('ticks the selected rows and reports row and header ticks', () => {
    const fixture = render({ selectedIdSet: new Set(['s1']) });
    const rowToggle = vi.fn();
    const allToggle = vi.fn();
    fixture.componentInstance.rowToggle.subscribe(rowToggle);
    fixture.componentInstance.allToggle.subscribe(allToggle);
    const [allBox, firstBox, secondBox] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]',
      ),
    );

    expect(firstBox.checked).toBe(false);
    expect(secondBox.checked).toBe(true);
    firstBox.click();
    allBox.click();
    expect(rowToggle).toHaveBeenCalledWith('m1');
    expect(allToggle).toHaveBeenCalledOnce();
  });

  it('reports the row behind each menu pick', () => {
    const fixture = render();
    const picks: unknown[][] = [];
    fixture.componentInstance.edit.subscribe((entry) => picks.push(['edit', entry]));
    fixture.componentInstance.statusChange.subscribe((entry) => picks.push(['status', entry]));
    fixture.componentInstance.remove.subscribe((entry) => picks.push(['remove', entry]));
    const menus = fixture.debugElement.queryAll((node) => node.name === 'app-row-actions-menu');

    menus[1].triggerEventHandler('edit');
    menus[1].triggerEventHandler('statusChange');
    menus[0].triggerEventHandler('remove');

    expect(picks).toEqual([
      ['edit', SEAFOOD],
      ['status', SEAFOOD],
      ['remove', RESTAURANTS],
    ]);
  });

  it('draws placeholder rows while loading', () => {
    const element = render({ isLoading: true }).nativeElement as HTMLElement;

    expect(element.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
    expect(element.textContent).not.toContain('مطاعم');
  });

  it('shows the empty message when there are no rows', () => {
    const element = render({
      entries: [],
      hasNoResults: true,
      emptyMessage: 'لا توجد نتائج مطابقة لبحثك',
    }).nativeElement as HTMLElement;

    expect(element.textContent).toContain('لا توجد نتائج مطابقة لبحثك');
  });
});

describe('CategoryTable name', () => {
  it('opens the category to edit when its name is clicked', () => {
    const fixture = render();
    const edited: unknown[] = [];
    fixture.componentInstance.edit.subscribe((entry) => edited.push(entry));

    const names = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '[data-role="open-category"]',
    );
    names[1].click();

    expect(edited).toEqual([SEAFOOD]);
  });
});
