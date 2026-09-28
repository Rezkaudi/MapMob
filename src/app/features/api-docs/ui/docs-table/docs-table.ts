import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DocsTable as DocsTableData } from '../../models/docs-section';

@Component({
  selector: 'app-docs-table',
  templateUrl: './docs-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsTable {
  readonly table = input.required<DocsTableData>();
}
