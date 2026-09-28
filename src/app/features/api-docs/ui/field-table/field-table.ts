import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ApiField } from '../../models/api-field';

@Component({
  selector: 'app-field-table',
  templateUrl: './field-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTable {
  readonly fields = input.required<readonly ApiField[]>();
}
