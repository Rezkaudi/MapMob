import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

const DEFAULT_RETRY_LABEL = 'إعادة المحاولة';

/** Shown in place of content that failed to load, with a way to ask for it again. */
@Component({
  selector: 'app-error-state',
  imports: [AppIcon],
  templateUrl: './error-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorState {
  readonly message = input.required<string>();
  readonly retryLabel = input<string>(DEFAULT_RETRY_LABEL);
  readonly retry = output<void>();
}
