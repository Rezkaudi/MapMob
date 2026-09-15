import { TestBed } from '@angular/core/testing';
import { Review } from '../../models/review';
import { buildReview } from '../../testing/review-fixture';
import { ReviewTable } from './review-table';

const AHMAD = buildReview();
const UNRATED = buildReview({ id: 'review-9', userName: 'خالد', rating: null, status: 'hidden' });

interface RenderOptions {
  readonly entries?: readonly Review[];
  readonly isLoading?: boolean;
  readonly hasNoResults?: boolean;
}

function render(options: RenderOptions = {}) {
  const fixture = TestBed.createComponent(ReviewTable);
  fixture.componentRef.setInput('entries', options.entries ?? [AHMAD, UNRATED]);
  fixture.componentRef.setInput('selectedIdSet', new Set(['review-9']));
  fixture.componentRef.setInput('isLoading', options.isLoading ?? false);
  fixture.componentRef.setInput('hasNoResults', options.hasNoResults ?? false);
  fixture.componentRef.setInput('emptyMessage', 'لا توجد نتائج مطابقة للبحث أو الفلاتر');
  fixture.componentRef.setInput('rowCount', 4);
  fixture.detectChanges();
  return fixture;
}

function cellsOf(row: Element): string[] {
  return Array.from(row.querySelectorAll('td'), (cell) => cell.textContent?.trim() ?? '');
}

describe('ReviewTable', () => {
  it('heads the columns in the design order', () => {
    const headers = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('th'),
      (header) => header.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'اسم المستخدم',
      'المكان',
      'التقيييم',
      'نص المراجعة والتعليق',
      'التاريخ',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('fills a row with the reviewer, place, stars, comment, date and status', () => {
    const [first, second] = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('tbody tr'),
    );

    expect(cellsOf(first).slice(1, 7)).toEqual([
      'أحمد جمال',
      'صيدلية الحياة',
      '5.0',
      'المكان ممتاز والخدمة سريعة جداً',
      '١٢ يناير ٢٠٢٤',
      'منشور',
    ]);
    expect(cellsOf(second)[3]).toBe('—');
    expect((second.querySelector('input[type="checkbox"]') as HTMLInputElement).checked).toBe(true);
  });

  it('opens a review from its name and from "عرض التفاصيل", and asks to delete from "حذف"', () => {
    const fixture = render();
    const view = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.view.subscribe(view);
    fixture.componentInstance.remove.subscribe(remove);
    const element = fixture.nativeElement as HTMLElement;

    (
      element.querySelector('tbody tr button[data-role="open-review"]') as HTMLButtonElement
    ).click();
    (element.querySelector('tbody tr app-row-actions-menu button') as HTMLButtonElement).click();
    fixture.detectChanges();
    const items = Array.from(
      document.querySelectorAll('[data-testid="action-menu-panel"] button'),
    ) as HTMLButtonElement[];
    expect(items.map((item) => item.textContent?.trim())).toEqual(['عرض التفاصيل', 'حذف']);
    items[1].click();

    expect(view).toHaveBeenCalledWith(AHMAD);
    expect(remove).toHaveBeenCalledWith(AHMAD);
  });

  it('reports the ticks', () => {
    const fixture = render();
    const rowToggle = vi.fn();
    const allToggle = vi.fn();
    fixture.componentInstance.rowToggle.subscribe(rowToggle);
    fixture.componentInstance.allToggle.subscribe(allToggle);
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('thead input') as HTMLInputElement).dispatchEvent(new Event('change'));
    (element.querySelector('tbody input') as HTMLInputElement).dispatchEvent(new Event('change'));

    expect(allToggle).toHaveBeenCalledOnce();
    expect(rowToggle).toHaveBeenCalledWith('review-1');
  });

  it('draws placeholder rows while loading, and the message when nothing matches', () => {
    expect(
      render({ isLoading: true }).nativeElement.querySelector('tbody[app-table-skeleton]'),
    ).toBeTruthy();
    expect(
      render({ entries: [], hasNoResults: true }).nativeElement.querySelector('app-table-empty')
        ?.textContent,
    ).toContain('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });
});
