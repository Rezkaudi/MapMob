import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePagination {
  readonly pageIndex = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalCount = input.required<number>();
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
  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.pageCount() }, (_, i) => i),
  );

  protected goTo(pageIndex: number): void {
    this.pageIndexChange.emit(pageIndex);
  }
}
