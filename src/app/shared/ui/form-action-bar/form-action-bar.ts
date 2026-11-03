import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PressedAction } from '../../state/pressed-action';
import { BusyLabel } from '../busy-label/busy-label';

/** The white bar under the offer and ad forms that stays on screen while the form scrolls. */
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
  /** Pages that only publish, like "انضم إلينا كمقدم خدمة", hide "حفظ كمسودة". */
  readonly isDraftVisible = input<boolean>(true);
  readonly saveDraft = output<void>();

  protected readonly pressedAction = new PressedAction<'save' | 'draft'>(this.isBusy);
  protected readonly isDraftSpinning = computed(() => this.pressedAction.spinning() === 'draft');
  /** Save also spins when the form was sent some other way, such as the Enter key. */
  protected readonly isSaveSpinning = computed(() => this.isBusy() && !this.isDraftSpinning());
}
