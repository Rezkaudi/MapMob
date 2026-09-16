import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ChoiceOption } from './choice-option';

/** `wrap` keeps the design's 60px chips; `fill` shares one row so a long group stays on one line. */
export type ChoiceChipsLayout = 'wrap' | 'fill';

const PICKED_CHIP = 'border-primary bg-primary text-white';
const IDLE_CHIP = 'border-border bg-white text-text-secondary hover:text-text-primary';
const GROUP_CLASSES: Record<ChoiceChipsLayout, string> = { wrap: 'flex-wrap', fill: 'flex-nowrap' };
const CHIP_SIZE_CLASSES: Record<ChoiceChipsLayout, string> = {
  wrap: 'min-w-[60px] px-2',
  fill: 'min-w-0 flex-1 px-1',
};

/** The row of 30px single-pick chips the filter panels draw for status and type. */
@Component({
  selector: 'app-choice-chips',
  templateUrl: './choice-chips.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoiceChips {
  readonly label = input.required<string>();
  readonly options = input.required<readonly ChoiceOption[]>();
  readonly selected = input<string | null>(null);
  readonly layout = input<ChoiceChipsLayout>('wrap');
  readonly selectedChange = output<string | null>();

  protected readonly groupClasses = computed(() => GROUP_CLASSES[this.layout()]);
  protected readonly chips = computed(() => {
    const sizeClasses = CHIP_SIZE_CLASSES[this.layout()];
    return this.options().map((option) => {
      const isPicked = option.value === this.selected();
      return { option, isPicked, classes: `${sizeClasses} ${isPicked ? PICKED_CHIP : IDLE_CHIP}` };
    });
  });
}
