import { ChangeDetectionStrategy, Component, input } from '@angular/core';

const DEFAULT_MESSAGE = 'لا توجد بيانات لعرضها';

/** The line a table shows under its header when it has no rows. */
@Component({
  selector: 'app-table-empty',
  templateUrl: './table-empty.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableEmpty {
  readonly message = input<string>(DEFAULT_MESSAGE);
}
