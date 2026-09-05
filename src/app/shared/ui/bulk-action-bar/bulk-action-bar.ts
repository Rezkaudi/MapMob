import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

@Component({
  selector: 'app-bulk-action-bar',
  imports: [AppIcon],
  templateUrl: './bulk-action-bar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkActionBar {
  readonly selectedCount = input.required<number>();
  readonly activate = output<void>();
  readonly suspend = output<void>();
  readonly notify = output<void>();
  readonly exportRows = output<void>();
  readonly remove = output<void>();
  readonly clear = output<void>();
}
