import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { StoryRepository } from '../../data/story.repository';
import {
  STORY_NOW,
  buildHiddenStoryEntry,
  buildStoryEntry,
  buildStorySummary,
} from '../../testing/story-fixture';
import { StoryList } from './story-list';

const ACTIVE = buildStoryEntry({ viewCount: 125 });
const HIDDEN = buildHiddenStoryEntry();
const FILE = new Blob(['csv']);

function render(overrides: Partial<StoryRepository> = {}) {
  const repository: Partial<StoryRepository> = {
    getStories: vi.fn(() => of({ items: [ACTIVE, HIDDEN], totalCount: 2 })),
    getSummary: () => of(buildStorySummary()),
    setStoryHidden: vi.fn(() => of(HIDDEN)),
    deleteStory: vi.fn((): Observable<void> => of(undefined)),
    exportStories: vi.fn(() => of(FILE)),
    ...overrides,
  };
  const fileSaver = { save: vi.fn() };
  TestBed.configureTestingModule({
    providers: [
      { provide: StoryRepository, useValue: repository },
      { provide: FileSaver, useValue: fileSaver },
      { provide: CLOCK, useValue: () => STORY_NOW },
    ],
  });
  const fixture = TestBed.createComponent(StoryList);
  fixture.detectChanges();
  return { fixture, repository, fileSaver, element: fixture.nativeElement as HTMLElement };
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  );
}

function openRowMenuItem(
  fixture: ReturnType<typeof render>['fixture'],
  rowIndex: number,
  label: string,
): void {
  const row = (fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr')[rowIndex];
  (row.querySelector('button[aria-haspopup]') as HTMLButtonElement).click();
  fixture.detectChanges();
  buttonNamed(row as HTMLElement, label)?.click();
  fixture.detectChanges();
}

describe('StoryList', () => {
  it('shows the header with export alone, the cards, the filters, the rows and the range', () => {
    const { element } = render();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('القصص');
    expect(element.textContent).toContain('إدارة ومتابعة القصص المنشورة من المتاجر .');
    expect(buttonNamed(element, 'تصدير')).toBeTruthy();
    expect(element.querySelector('app-add-button')).toBeNull();
    expect(element.querySelectorAll('app-stat-card')).toHaveLength(4);
    expect(element.querySelector('tbody')?.textContent).toContain('صيدلية الشفاء');
    expect(element.textContent).toContain('عرض 1- 2 من 2 قصة');
  });

  it('keeps the frame order and spacing: header, cards 20px, filters 40px, table 32px, paging 4px', () => {
    const { element } = render();
    const blocks = [...element.children].filter((child) => child.tagName !== 'APP-PAGE-HEADER');

    expect(element.firstElementChild?.tagName).toBe('APP-PAGE-HEADER');
    expect(
      blocks
        .slice(0, 4)
        .map((block) => [
          block.getAttribute('data-role') ?? block.tagName.toLowerCase(),
          block.className,
        ]),
    ).toEqual([
      ['stat-cards', expect.stringContaining('mt-5')],
      ['app-story-filter-bar', expect.stringContaining('mt-10')],
      ['app-story-table', expect.stringContaining('mt-8')],
      ['app-table-pagination', expect.stringContaining('mt-1')],
    ]);
  });

  it('lists the cards from the right: all, active, expired, views', () => {
    const { element } = render();
    const values = Array.from(element.querySelectorAll('[data-role="value"]'), (value) =>
      value.textContent?.trim(),
    );

    expect(values).toEqual(['124', '10', '21', '1,200']);
    expect(element.querySelector('[data-role="stat-cards"]')?.classList).toContain('gap-5');
  });

  it('filters the table from a status chip', () => {
    const { fixture, element, repository } = render();

    [...element.querySelectorAll<HTMLButtonElement>('app-filter-chips button')][2].click();
    fixture.detectChanges();

    expect(repository.getStories).toHaveBeenLastCalledWith({
      pageIndex: 0,
      pageSize: 4,
      status: 'hidden',
    });
  });

  it('opens the drawer of a row from its menu, with hide and delete in the footer', () => {
    const { fixture, element } = render();

    openRowMenuItem(fixture, 0, 'عرض القصة');

    const drawer = element.querySelector('app-story-detail-drawer')!;
    expect(drawer.querySelector('h2')?.textContent?.trim()).toBe('عرض القصة');
    expect(drawer.textContent).toContain('125 مشاهدة');
    expect(
      [...drawer.querySelectorAll('footer button')].map((button) => button.textContent?.trim()),
    ).toEqual(['إخفاء القصة', 'حذف القصة']);
  });

  it('swaps the drawer for the hide question, then hides the story', async () => {
    const { fixture, element, repository } = render();
    openRowMenuItem(fixture, 0, 'عرض القصة');

    buttonNamed(element.querySelector('app-story-detail-drawer')!, 'إخفاء القصة')?.click();
    fixture.detectChanges();

    expect(element.querySelector('app-story-detail-drawer')).toBeNull();
    const dialog = element.querySelector('app-confirm-action-dialog')!;
    expect(dialog.querySelector('h2')?.textContent?.trim()).toBe('إخفاء القصة');
    expect(dialog.querySelector('[data-role="context-tag"]')?.textContent?.trim()).toBe(
      'الحالة: نشطة',
    );

    buttonNamed(dialog as HTMLElement, 'إخفاء القصة')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(repository.setStoryHidden).toHaveBeenCalledWith(ACTIVE.id, true);
    expect(element.querySelector('app-confirm-action-dialog')).toBeNull();
  });

  it('shows a hidden story again after asking', async () => {
    const { fixture, element, repository } = render();

    openRowMenuItem(fixture, 1, 'إظهار القصة');
    const dialog = element.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(dialog.querySelector('[data-role="confirm-detail"]')).toBeNull();
    buttonNamed(dialog, 'إظهار القصة')?.click();
    await fixture.whenStable();

    expect(repository.setStoryHidden).toHaveBeenCalledWith(HIDDEN.id, false);
  });

  it('deletes a story after the red warning', async () => {
    const { fixture, element, repository } = render();

    openRowMenuItem(fixture, 0, 'حذف القصة');
    const dialog = element.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(dialog.querySelector('[data-role="confirm-detail"]')?.textContent?.trim()).toBe(
      'تنبيه: إجراء نهائي لا يمكن التراجع عنه',
    );
    buttonNamed(dialog, 'حذف القصة')?.click();
    await fixture.whenStable();

    expect(repository.deleteStory).toHaveBeenCalledWith(ACTIVE.id);
  });

  it('closes a question without saving', () => {
    const { fixture, element, repository } = render();
    openRowMenuItem(fixture, 0, 'حذف القصة');

    buttonNamed(element, 'إلغاء')?.click();
    fixture.detectChanges();

    expect(element.querySelector('app-confirm-action-dialog')).toBeNull();
    expect(repository.deleteStory).not.toHaveBeenCalled();
  });

  it('saves the export as a dated CSV file', async () => {
    const { fixture, element, repository, fileSaver } = render();

    buttonNamed(element, 'تصدير')?.click();
    await fixture.whenStable();

    expect(repository.exportStories).toHaveBeenCalledWith({
      query: { pageIndex: 0, pageSize: 4 },
      ids: [],
    });
    expect(fileSaver.save).toHaveBeenCalledWith(FILE, 'stories-2026-10-01.csv');
  });

  it('shows the error with a retry instead of the table', () => {
    const { element } = render({
      getStories: () => new Observable((subscriber) => subscriber.error(new Error('تعذر التحميل'))),
    });

    expect(element.querySelector('app-error-state')?.textContent).toContain('تعذر التحميل');
    expect(element.querySelector('app-story-table')).toBeNull();
  });
});
