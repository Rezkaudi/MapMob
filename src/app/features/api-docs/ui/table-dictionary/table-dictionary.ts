import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DbColumn } from '../../models/db-column';
import { DbTable } from '../../models/db-table';

@Component({
  selector: 'app-table-dictionary',
  templateUrl: './table-dictionary.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDictionary {
  readonly table = input.required<DbTable>();
  readonly isForcedOpen = input(false);

  protected keyOf(column: DbColumn): string {
    if (column.references) {
      return `${column.key === 'pk' ? 'PK, FK' : 'FK'} → ${column.references}`;
    }
    return column.key?.toUpperCase() ?? '';
  }
}
