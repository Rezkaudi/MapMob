import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ChoiceOption } from '../choice-chips/choice-option';

const PICKED_SEGMENT = 'bg-white font-medium text-primary shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]';
const IDLE_SEGMENT = 'font-normal text-text-secondary hover:text-text-primary';

/** The 48px grey track with one raised white segment, as the payment dialog draws it. */
@Component({
  selector: 'app-segmented-choice',
  templateUrl: './segmented-choice.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedChoice {
  readonly label = input.required<string>();
  readonly options = input.required<readonly ChoiceOption[]>();
  readonly selected = input.required<string | null>();
  readonly selectedChange = output<string | null>();

  protected readonly segments = computed(() =>
    this.options().map((option) => {
      const isPicked = option.value === this.selected();
      return { option, isPicked, classes: isPicked ? PICKED_SEGMENT : IDLE_SEGMENT };
    }),
  );
}
