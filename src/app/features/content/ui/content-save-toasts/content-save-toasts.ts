import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Toast } from '../../../../shared/ui/toast/toast';

/** The confirmation or error that floats up after a content page is saved. */
@Component({
  selector: 'app-content-save-toasts',
  imports: [Toast],
  templateUrl: './content-save-toasts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentSaveToasts {
  readonly isSaved = input<boolean>(false);
  readonly saveError = input<string | null>(null);
  readonly savedDismissed = output<void>();
  readonly errorDismissed = output<void>();
}
