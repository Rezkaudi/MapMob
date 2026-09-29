import { TestBed } from '@angular/core/testing';
import { OwnerReview } from '../../models/owner-review';
import { buildOwnerReview } from '../../testing/owner-review-fixture';
import { OwnerReviewTable } from './owner-review-table';

const AHMAD = buildOwnerReview({ id: 'r1', createdAt: '2024-01-12T10:00:00.000Z' });
const SARA = buildOwnerReview({
  id: 'r2',
  author: { id: 'user-2', name: 'سارة علي' },
  rating: null,
  reportStatus: 'pending',
});

function build(entries: readonly OwnerReview[] = [AHMAD, SARA]) {
  const fixture = TestBed.createComponent(OwnerReviewTable);
  fixture.componentRef.setInput('entries', entries);
  fixture.componentRef.setInput('selectedIdSet', new Set(['r2']));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function cellsOf(row: Element): string[] {
  return Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim() ?? '');
}

describe('OwnerReviewTable', () => {
  it('heads the columns as the design does, right to left', () => {
    const headers = Array.from(build().element.querySelectorAll('th')).map(
      (header) => header.textContent?.trim() ?? '',
    );

    expect(headers).toEqual([
      '',
      'اسم صاحب التقييم',
      'التقيييم',
      'نص المراجعة والتعليق',
      'التاريخ',
      'حالة البلاغ',
      'الإجراء',
    ]);
  });

  it('shows each review with its stars, comment, date and report status', () => {
    const rows = build().element.querySelectorAll('tbody tr');
    const [, name, rating, comment, date, status] = cellsOf(rows[0]);

    expect(name).toBe('أحمد جمال');
    expect(rating).toBe('5.0');
    expect(comment).toContain(AHMAD.comment);
    expect(comment).toContain('عرض المراجعة كاملة');
    expect(date).toBe('١٢ يناير ٢٠٢٤');
    expect(status).toBe('غير مبلغ عنه');
    expect(cellsOf(rows[1])[2]).toBe('—');
  });

  it('opens the full review from its link', () => {
    const { fixture, element } = build();
    const opened: OwnerReview[] = [];
    fixture.componentInstance.view.subscribe((review) => opened.push(review));

    element.querySelector<HTMLButtonElement>('[data-role="open-review"]')!.click();

    expect(opened).toEqual([AHMAD]);
  });

  it('ticks the selected rows and tells which one was toggled', () => {
    const { fixture, element } = build();
    const toggled: string[] = [];
    fixture.componentInstance.rowToggle.subscribe((id) => toggled.push(id));
    const boxes = element.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]');

    boxes[0].click();

    expect(boxes[1].checked).toBe(true);
    expect(toggled).toEqual(['r1']);
  });

  it('says so when there is nothing to show', () => {
    const fixture = TestBed.createComponent(OwnerReviewTable);
    fixture.componentRef.setInput('entries', []);
    fixture.componentRef.setInput('hasNoResults', true);
    fixture.componentRef.setInput('emptyMessage', 'لا توجد تقييمات لعرضها');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لا توجد تقييمات لعرضها');
  });
});
