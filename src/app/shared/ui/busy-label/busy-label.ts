import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Spinner } from '../spinner/spinner';

const SPINNER_SIZE_PX = 16;

/** A button's text with a spinner in front of it while the button's request runs. */
@Component({
  selector: 'app-busy-label',
  imports: [Spinner],
  templateUrl: './busy-label.html',
  // A block row: the button centres it, and the spinner sits on the text's middle, not its baseline.
  host: { class: 'flex items-center justify-center gap-2' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusyLabel {
  readonly isBusy = input<boolean>(false);

  protected readonly spinnerSize = SPINNER_SIZE_PX;
}
