import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

const MAX_VISIBLE_PAGES = 3;

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

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.totalCount() / this.pageSize())),
  );
  protected readonly rangeStart = computed(() =>
    this.totalCount() === 0 ? 0 : this.pageIndex() * this.pageSize() + 1,
  );
  protected readonly rangeEnd = computed(() =>
    Math.min(this.totalCount(), (this.pageIndex() + 1) * this.pageSize()),
  );

  /** The design shows the first few pages, an ellipsis, then the last page. */
  protected readonly leadingPages = computed(() =>
    Array.from({ length: Math.min(MAX_VISIBLE_PAGES, this.pageCount()) }, (_, index) => index),
  );
  protected readonly hasTrailingPage = computed(() => this.pageCount() > MAX_VISIBLE_PAGES);
  protected readonly lastPageIndex = computed(() => this.pageCount() - 1);

  protected readonly isFirstPage = computed(() => this.pageIndex() === 0);
  protected readonly isLastPage = computed(() => this.pageIndex() >= this.pageCount() - 1);

  protected goTo(pageIndex: number): void {
    this.pageIndexChange.emit(pageIndex);
  }
}
