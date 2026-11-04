import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BusyLabel } from '../busy-label/busy-label';

/** The white bar under the long forms that stays on screen while the form scrolls. */
@Component({
  selector: 'app-form-action-bar',
  imports: [RouterLink, BusyLabel],
  templateUrl: './form-action-bar.html',
  host: { class: 'sticky -bottom-8 z-30 -mx-8 -mb-8 block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormActionBar {
  readonly saveLabel = input.required<string>();
  readonly cancelLink = input.required<string>();
  readonly isBusy = input<boolean>(false);
}
