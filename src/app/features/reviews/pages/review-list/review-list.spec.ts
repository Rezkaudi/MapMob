import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { ReviewRepository } from '../../data/review.repository';
import { buildReview, buildReviewDetail } from '../../testing/review-fixture';
import { ReviewList } from './review-list';

const REPORTED = buildReviewDetail();
const SUMMARY = { totalCount: 3000, averageRating: 4.3, newCount: 14, reportedCount: 4 };

function createPage(overrides: Partial<ReviewRepository> = {}) {
  const calls: string[] = [];
  const repository: Partial<ReviewRepository> = {
    getReviews: () => of({ items: [buildReview(), REPORTED.review], totalCount: 3000 }),
    getSummary: () => of(SUMMARY),
    getReviewDetail: () => of(REPORTED),
    acceptReport: (id) => {
      calls.push(`accept ${id}`);
      return of(REPORTED.review);
    },
    deleteReview: (id) => {
      calls.push(`delete ${id}`);
      return of(undefined) as Observable<void>;
    },
    exportReviews: () => of(new Blob(['csv'])),
    ...overrides,
  };
  const savedFiles: string[] = [];
  TestBed.configureTestingModule({
    providers: [
      { provide: ReviewRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date(2026, 8, 15) },
      {
        provide: FileSaver,
        useValue: { save: (_file: Blob, name: string) => savedFiles.push(name) },
      },
    ],
  });
  const fixture = TestBed.createComponent(ReviewList);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, calls, savedFiles };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

async function settle(fixture: ReturnType<typeof createPage>['fixture']): Promise<void> {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('ReviewList', () => {
  it('shows the header, the four stat cards, the toolbar, the table and the paging', () => {
    const { element } = createPage();
    const text = element.textContent ?? '';

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('التقييمات والمراجعات');
    expect(element.querySelector('app-export-button')).toBeTruthy();
    expect(element.querySelectorAll('app-stat-card')).toHaveLength(4);
    expect(element.querySelector('[data-role="alert"]')?.textContent?.trim()).toBe('تتطلب إجراء');
    expect(element.querySelector('app-review-toolbar')).toBeTruthy();
    expect(element.querySelectorAll('app-review-table tbody tr')).toHaveLength(2);
    expect(text).toContain('من 3000 تقييم');
  });

  it('shows only the header and the empty message when there are no reviews at all', () => {
    const { element } = createPage({ getReviews: () => of({ items: [], totalCount: 0 }) });

    expect(element.textContent).toContain('لا توجد تقييمات مضافة حتى الآن');
    expect(element.querySelector('app-export-button')).toBeNull();
    expect(element.querySelector('app-stat-card')).toBeNull();
    expect(element.querySelector('app-review-toolbar')).toBeNull();
    expect(element.querySelector('app-review-table')).toBeNull();
  });

  it('opens a review in the drawer and closes it once its report is accepted', async () => {
    const { fixture, element, calls } = createPage();

    (element.querySelectorAll('button[data-role="open-review"]')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(element.querySelector('app-review-detail-drawer')?.textContent).toContain('ID: #4920');

    buttonNamed(element, 'قبول وإخفاء التقييم').click();
    await settle(fixture);

    expect(calls).toEqual(['accept review-2']);
    expect(element.querySelector('app-review-detail-drawer')).toBeNull();
  });

  it('asks before deleting for good, then deletes and closes the drawer', async () => {
    const { fixture, element, calls } = createPage();
    (element.querySelectorAll('button[data-role="open-review"]')[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    buttonNamed(element, 'حذف التقييم نهائياً من المنصة').click();
    fixture.detectChanges();
    const dialog = element.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(dialog.textContent).toContain('هل أنت متأكد من حذف تقييم سارة محمد؟');
    expect(calls).toEqual([]);
    buttonNamed(dialog, 'حذف التقييم').click();
    await settle(fixture);

    expect(calls).toEqual(['delete review-2']);
    expect(element.querySelector('app-confirm-action-dialog')).toBeNull();
    expect(element.querySelector('app-review-detail-drawer')).toBeNull();
  });

  it('saves the export under a dated file name', async () => {
    const { fixture, element, savedFiles } = createPage();

    buttonNamed(element, 'تصدير').click();
    await settle(fixture);

    expect(savedFiles).toEqual(['reviews-2026-09-15.csv']);
  });
});
