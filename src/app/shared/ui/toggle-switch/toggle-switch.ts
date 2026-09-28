import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ToggleSwitchSize = 'regular' | 'small';

interface SwitchSkin {
  readonly track: string;
  readonly offTrack: string;
  readonly knob: string;
  readonly onKnob: string;
}

const TRACK_BASE =
  'inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60';

/** Regular is the forms' 44×24 switch; small is the 36×20 one of the merchant hours card. */
const SKINS: Record<ToggleSwitchSize, SwitchSkin> = {
  regular: {
    track: 'h-6 w-11',
    offTrack: 'bg-border',
    knob: 'size-5 shadow',
    onKnob: '-translate-x-5',
  },
  small: { track: 'h-5 w-9', offTrack: 'bg-[#d8dadc]', knob: 'size-4', onKnob: '-translate-x-4' },
};

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.html',
  host: { class: 'inline-flex' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitch {
  readonly isOn = input.required<boolean>();
  readonly label = input<string>('');
  readonly isDisabled = input<boolean>(false);
  readonly size = input<ToggleSwitchSize>('regular');
  readonly toggled = output<boolean>();

  protected readonly trackClasses = computed(() => {
    const skin = SKINS[this.size()];
    return `${TRACK_BASE} ${skin.track} ${this.isOn() ? 'bg-primary' : skin.offTrack}`;
  });

  protected readonly knobClasses = computed(() => {
    const skin = SKINS[this.size()];
    return `rounded-full bg-white transition-transform ${skin.knob} ${this.isOn() ? skin.onKnob : 'translate-x-0'}`;
  });
}
