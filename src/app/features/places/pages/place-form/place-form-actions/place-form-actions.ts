import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BusyLabel } from '../../../../../shared/ui/busy-label/busy-label';

/** The sticky save bar under the place form. The submit button submits the enclosing form. */
@Component({
  selector: 'app-place-form-actions',
  imports: [RouterLink, BusyLabel],
  templateUrl: './place-form-actions.html',
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceFormActions {
  readonly isBusy = input<boolean>(false);
}
