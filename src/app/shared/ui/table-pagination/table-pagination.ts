import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/** Pages drawn either side of the current one before the list falls back to an ellipsis. */
const NEIGHBOUR_PAGES = 1;
/** First page, last page, the current page, its neighbours, and a gap marker on each side. */
const MAX_VISIBLE_STEPS = NEIGHBOUR_PAGES * 2 + 5;
const GAP = 'gap' as const;

/** A page number to jump to, or the gap marker drawn between two runs of pages. */
export type PageStep = number | typeof GAP;

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePagination {
  readonly pageIndex = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalCount = input.required<number>();
  /** The noun the design puts after the total, e.g. "مستخدم". */
  readonly itemNoun = input<string>('عنصر');
  readonly pageIndexChange = output<number>();

  protected readonly gap = GAP;

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.totalCount() / this.pageSize())),
  );
  protected readonly rangeStart = computed(() =>
    this.totalCount() === 0 ? 0 : this.pageIndex() * this.pageSize() + 1,
  );
  protected readonly rangeEnd = computed(() =>
    Math.min(this.totalCount(), (this.pageIndex() + 1) * this.pageSize()),
  );

  /**
   * Every page while they fit, otherwise the first and last page with a window around
   * the current one, so the page you are on is always shown and always clickable.
   */
  protected readonly pageSteps = computed<readonly PageStep[]>(() => {
    const pageCount = this.pageCount();
    if (pageCount <= MAX_VISIBLE_STEPS) {
      return allPages(pageCount);
    }

    const current = this.pageIndex();
    const lastPage = pageCount - 1;
    const windowStart = clamp(current - NEIGHBOUR_PAGES, 1, lastPage - NEIGHBOUR_PAGES * 2 - 1);
    const windowEnd = windowStart + NEIGHBOUR_PAGES * 2;

    return [
      0,
      ...(windowStart > 1 ? [GAP] : []),
      ...range(windowStart, windowEnd),
      ...(windowEnd < lastPage - 1 ? [GAP] : []),
      lastPage,
    ];
  });

  protected readonly isFirstPage = computed(() => this.pageIndex() === 0);
  protected readonly isLastPage = computed(() => this.pageIndex() >= this.pageCount() - 1);

  protected goTo(pageIndex: number): void {
    if (pageIndex === this.pageIndex()) {
      return;
    }
    this.pageIndexChange.emit(pageIndex);
  }
}

function allPages(pageCount: number): readonly number[] {
  return Array.from({ length: pageCount }, (_, index) => index);
}

function range(start: number, end: number): readonly number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function clamp(value: number, lowest: number, highest: number): number {
  return Math.min(Math.max(value, lowest), highest);
}
