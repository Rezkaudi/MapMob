import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** The sticky save bar under the place form. The submit button submits the enclosing form. */
@Component({
  selector: 'app-place-form-actions',
  imports: [RouterLink],
  templateUrl: './place-form-actions.html',
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceFormActions {}
