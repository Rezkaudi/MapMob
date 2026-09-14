import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SegmentOption, SegmentTone } from './segment-option';

interface ToneClasses {
  readonly pickedText: string;
  readonly pickedDot: string;
  readonly idleDot: string;
}

/** Primary options mark only the picked dot; the status options colour their dots even when idle. */
const TONE_CLASSES: Record<SegmentTone, ToneClasses> = {
  primary: {
    pickedText: 'text-primary',
    pickedDot: 'bg-primary',
    idleDot: 'border-text-secondary',
  },
  success: {
    pickedText: 'text-status-success',
    pickedDot: 'bg-status-success',
    idleDot: 'border-status-success',
  },
  danger: { pickedText: 'text-closed', pickedDot: 'bg-closed', idleDot: 'border-closed' },
};

const PICKED_BUTTON = 'bg-white font-bold shadow-[0_0_0_1px_#e2e8f0,0_1px_2px_0_rgba(0,0,0,0.05)]';
const IDLE_BUTTON = 'font-medium text-text-secondary hover:text-text-primary';

interface SegmentItem {
  readonly option: SegmentOption;
  readonly isPicked: boolean;
  readonly buttonClasses: string;
  readonly dotClasses: string;
}

/** The grey pill track with three equal options the filter panel uses for type and status. */
@Component({
  selector: 'app-filter-segmented-control',
  templateUrl: './filter-segmented-control.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSegmentedControl {
  readonly label = input.required<string>();
  readonly options = input.required<readonly SegmentOption[]>();
  readonly selected = input<string | null>(null);
  readonly selectedChange = output<string | null>();

  protected readonly items = computed<readonly SegmentItem[]>(() =>
    this.options().map((option) => {
      const isPicked = option.value === this.selected();
      const tone = TONE_CLASSES[option.tone];
      return {
        option,
        isPicked,
        buttonClasses: isPicked ? `${PICKED_BUTTON} ${tone.pickedText}` : IDLE_BUTTON,
        dotClasses: isPicked ? tone.pickedDot : `border ${tone.idleDot}`,
      };
    }),
  );
}
