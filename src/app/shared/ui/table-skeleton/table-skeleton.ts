import { ChangeDetectionStrategy, Component, HostBinding, computed, input } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';

const DEFAULT_ROW_COUNT = 5;

function countTo(total: number): readonly number[] {
  return Array.from({ length: total }, (_unused, index) => index);
}

/** Placeholder rows for a table that is still loading. Sits in place of the real `tbody`. */
@Component({
  selector: 'tbody[app-table-skeleton]',
  imports: [Skeleton],
  templateUrl: './table-skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSkeleton {
  readonly columnCount = input.required<number>();
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  @HostBinding('attr.aria-hidden') protected readonly isHiddenFromScreenReaders = 'true';

  protected readonly rows = computed(() => countTo(this.rowCount()));
  protected readonly columns = computed(() => countTo(this.columnCount()));
}
