import { TestBed } from '@angular/core/testing';
import { StoryEntry } from '../../models/story-entry';
import { toStoryRow } from '../../state/story-row';
import {
  buildExpiredStoryEntry,
  buildHiddenStoryEntry,
  buildStoryEntry,
} from '../../testing/story-fixture';
import { StoryTable } from './story-table';

const ACTIVE = buildStoryEntry({
  place: { id: 'place-4', name: 'كافيه ورد' },
  publishedAt: '2024-01-12T09:00:00.000Z',
  viewCount: 124,
});
const HIDDEN = buildHiddenStoryEntry();
const EXPIRED = buildExpiredStoryEntry();

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(StoryTable);
  fixture.componentRef.setInput('rows', [ACTIVE, HIDDEN, EXPIRED].map(toStoryRow));
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

function pickFromMenu(fixture: ReturnType<typeof render>, rowIndex: number, label: string): void {
  const row = rowsOf(fixture.nativeElement)[rowIndex];
  (row.querySelector('button[aria-haspopup]') as HTMLButtonElement).click();
  fixture.detectChanges();
  const item = Array.from(row.querySelectorAll('[data-testid="action-menu-panel"] button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
  item.click();
  fixture.detectChanges();
}

describe('StoryTable', () => {
  it('draws the frame headers, the tick box first on the right', () => {
    const headers = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('th'),
      (cell) => cell.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'اسم المتجر',
      'القصة',
      'تاريخ النشر',
      'المشاهدات',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('fills each row from its story', () => {
    const [active, hidden, expired] = rowsOf(render().nativeElement);

    expect(cellTexts(active)).toEqual(['', 'كافيه ورد', '', '١٢ يناير ٢٠٢٤', '124', 'نشطة', '']);
    expect(cellTexts(hidden)[5]).toBe('مخفية');
    expect(cellTexts(expired)[5]).toBe('منتهية');
  });

  it('draws 89px rows under a 59px header', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('thead tr')?.classList).toContain('h-[59px]');
    expect(rowsOf(element)[0].classList).toContain('h-[89px]');
  });

  it('paints the status pills green, amber and grey', () => {
    const pills = rowsOf(render().nativeElement).map(
      (row) => row.querySelector('[data-role="status-pill"]')!.className,
    );

    expect(pills[0]).toContain('bg-status-success');
    expect(pills[1]).toContain('bg-accent');
    expect(pills[2]).toContain('bg-[#94a3b8]');
  });

  it('leads the view count with the eye, so RTL draws the eye on its right', () => {
    const views = rowsOf(render().nativeElement)[0].querySelector('[data-role="views"]')!;

    expect([...views.children].map((child) => child.tagName)).toEqual(['APP-ICON', 'SPAN']);
  });

  it('opens the story from its thumbnail', () => {
    const fixture = render();
    const viewed: StoryEntry[] = [];
    fixture.componentInstance.view.subscribe((story) => viewed.push(story));

    const thumbnail = rowsOf(fixture.nativeElement)[1].querySelector(
      'app-story-thumbnail button',
    ) as HTMLButtonElement;
    expect(thumbnail.getAttribute('aria-label')).toBe('عرض قصة صيدلية الشفاء');
    thumbnail.click();

    expect(viewed).toEqual([HIDDEN]);
  });

  it('offers view, hide or show, and delete from the row menu', () => {
    const fixture = render();
    const picked: [string, StoryEntry][] = [];
    fixture.componentInstance.view.subscribe((story) => picked.push(['view', story]));
    fixture.componentInstance.hide.subscribe((story) => picked.push(['hide', story]));
    fixture.componentInstance.show.subscribe((story) => picked.push(['show', story]));
    fixture.componentInstance.remove.subscribe((story) => picked.push(['remove', story]));

    pickFromMenu(fixture, 0, 'عرض القصة');
    pickFromMenu(fixture, 0, 'إخفاء القصة');
    pickFromMenu(fixture, 1, 'إظهار القصة');
    pickFromMenu(fixture, 2, 'حذف القصة');

    expect(picked).toEqual([
      ['view', ACTIVE],
      ['hide', ACTIVE],
      ['show', HIDDEN],
      ['remove', EXPIRED],
    ]);
  });

  it('reports ticks on a row and on the header box', () => {
    const fixture = render({ selectedIdSet: new Set([ACTIVE.id]) });
    const toggled: string[] = [];
    let allToggleCount = 0;
    fixture.componentInstance.rowToggle.subscribe((id) => toggled.push(id));
    fixture.componentInstance.allToggle.subscribe(() => allToggleCount++);
    const boxes = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    );

    expect(boxes[1].checked).toBe(true);
    expect(boxes[2].getAttribute('aria-label')).toBe('تحديد قصة صيدلية الشفاء');
    boxes[2].click();
    boxes[0].click();

    expect(toggled).toEqual([HIDDEN.id]);
    expect(allToggleCount).toBe(1);
  });

  it('shows skeleton rows while loading', () => {
    const element = render({ isLoading: true, rowCount: 4 }).nativeElement as HTMLElement;

    expect(element.querySelector('tbody[app-table-skeleton]')).not.toBeNull();
  });

  it('shows the empty message when nothing matches', () => {
    const element = render({
      rows: [],
      hasNoResults: true,
      emptyMessage: 'لا توجد قصص بهذه الحالة',
    }).nativeElement as HTMLElement;

    expect(element.querySelector('app-table-empty')?.textContent).toContain(
      'لا توجد قصص بهذه الحالة',
    );
  });
});
