import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

/** The white bar under the offer and ad forms that stays on screen while the form scrolls. */
@Component({
  selector: 'app-form-action-bar',
  imports: [RouterLink],
  templateUrl: './form-action-bar.html',
  host: { class: 'sticky -bottom-8 z-30 -mx-8 -mb-8 block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormActionBar {
  readonly saveLabel = input.required<string>();
  readonly cancelLink = input.required<string>();
  readonly isBusy = input<boolean>(false);
  readonly saveDraft = output<void>();
}
