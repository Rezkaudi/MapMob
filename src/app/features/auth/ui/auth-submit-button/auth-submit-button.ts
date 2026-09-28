import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Spinner } from '../../../../shared/ui/spinner/spinner';

@Component({
  selector: 'app-auth-submit-button',
  imports: [Spinner],
  templateUrl: './auth-submit-button.html',
  host: { class: 'block w-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSubmitButton {
  readonly label = input.required<string>();
  /** Read by screen readers while the request runs. */
  readonly busyLabel = input.required<string>();
  readonly isBusy = input<boolean>(false);
}
