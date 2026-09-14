import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/** The 93×45 outlined "تصدير" button the list headers carry. */
@Component({
  selector: 'app-export-button',
  imports: [AppIcon],
  templateUrl: './export-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportButton {
  readonly isBusy = input<boolean>(false);
  readonly pressed = output<void>();
}
