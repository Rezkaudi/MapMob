import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

@Component({
  selector: 'app-table-toolbar',
  imports: [AppIcon],
  templateUrl: './table-toolbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableToolbar {
  readonly searchPlaceholder = input<string>('');
  readonly queryChange = output<string>();

  protected onInput(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }
}
