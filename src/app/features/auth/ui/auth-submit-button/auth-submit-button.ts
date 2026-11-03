import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
  /** `false` when another button on the form started the wait; it spins there instead. */
  readonly isSpinning = input<boolean | null>(null);

  protected readonly showsSpinner = computed(() => this.isSpinning() ?? this.isBusy());
}
