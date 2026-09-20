import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { buildGovernorate } from '../../testing/region-entry-fixture';
import { RegionTable } from './region-table';

const TARTUS = buildGovernorate({ id: 'a', name: 'طرطوس', subAreaCount: 4, placeCount: 1200 });
const LATAKIA = buildGovernorate({ id: 'b', name: 'اللاذقية', status: 'suspended' });

function render(inputs: Record<string, unknown> = {}) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(RegionTable);
  fixture.componentRef.setInput('nameHeader', 'المحافظة');
  fixture.componentRef.setInput('entries', [TARTUS, LATAKIA]);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

function rowsOf(element: HTMLElement): HTMLTableRowElement[] {
  return Array.from(element.querySelectorAll('tbody tr'));
}

function openMenuOfFirstRow(fixture: ReturnType<typeof render>): HTMLElement {
  const row = rowsOf(fixture.nativeElement)[0];
  (row.querySelector('button[aria-haspopup]') as HTMLButtonElement).click();
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('[data-testid="action-menu-panel"]');
}

describe('RegionTable', () => {
  it('draws the design headers with the given name column', () => {
    const headers = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('th'),
      (cell) => cell.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'المحافظة',
      'عدد المناطق',
      'عدد الأماكن',
      'الحالة',
      'آخر تحديث',
      'الإجراء',
    ]);
  });

  it('draws one row per entry with its counts, status and date', () => {
    const [first, second] = rowsOf(render().nativeElement);

    expect(first.textContent).toContain('طرطوس');
    expect(first.textContent).toContain('4');
    expect(first.textContent).toContain('1200');
    expect(first.textContent).toContain('نشط');
    expect(first.textContent).toContain('١٢ يناير ٢٠٢٤');
    expect(second.textContent).toContain('معطلة');
  });

  it('links each name when a link is given', () => {
    const fixture = render({
      entryLink: (entry: { id: string }) => ['/regions', entry.id, 'areas'],
    });

    const link = rowsOf(fixture.nativeElement)[0].querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/regions/a/areas');
  });

  it('shows plain names without a link', () => {
    expect(rowsOf(render().nativeElement)[0].querySelector('a')).toBeNull();
  });

  it('ticks the selected rows and reports row and header ticks', () => {
    const fixture = render({ selectedIdSet: new Set(['b']), areAllSelected: false });
    const rowToggle = vi.fn();
    const allToggle = vi.fn();
    fixture.componentInstance.rowToggle.subscribe(rowToggle);
    fixture.componentInstance.allToggle.subscribe(allToggle);
    const element = fixture.nativeElement as HTMLElement;
    const [allBox, firstBox, secondBox] = Array.from(
      element.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'),
    );

    expect(firstBox.checked).toBe(false);
    expect(secondBox.checked).toBe(true);

    firstBox.click();
    allBox.click();
    expect(rowToggle).toHaveBeenCalledWith('a');
    expect(allToggle).toHaveBeenCalledOnce();
  });

  it('reports the edit, status and delete actions for a row', () => {
    const fixture = render();
    const edit = vi.fn();
    const statusChange = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.statusChange.subscribe(statusChange);
    fixture.componentInstance.remove.subscribe(remove);

    const labels = ['تعديل', 'تغيير الحالة', 'حذف'];
    for (const label of labels) {
      const panel = openMenuOfFirstRow(fixture);
      const item = Array.from(panel.querySelectorAll('button')).find(
        (button) => button.textContent?.trim() === label,
      ) as HTMLButtonElement;
      item.click();
      fixture.detectChanges();
    }

    expect(edit).toHaveBeenCalledWith(TARTUS);
    expect(statusChange).toHaveBeenCalledWith(TARTUS);
    expect(remove).toHaveBeenCalledWith(TARTUS);
  });

  it('draws placeholder rows while loading', () => {
    const element = render({ isLoading: true }).nativeElement as HTMLElement;

    expect(element.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
    expect(element.textContent).not.toContain('طرطوس');
  });

  it('says so when a search matches nothing', () => {
    const element = render({ entries: [], hasNoResults: true }).nativeElement as HTMLElement;

    expect(element.textContent).toContain('لا توجد نتائج مطابقة لبحثك');
  });
});

describe('RegionTable name', () => {
  it('opens an area to edit when its name is clicked and it has no page of its own', () => {
    const fixture = render();
    const edited: unknown[] = [];
    fixture.componentInstance.edit.subscribe((entry) => edited.push(entry));

    const names = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '[data-role="open-area"]',
    );
    names[1].click();

    expect(edited).toEqual([LATAKIA]);
  });
});
