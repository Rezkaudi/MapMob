import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** 16px under the header in most cards; the account and platform info cards leave 24px. */
export type SettingsCardSpacing = 'regular' | 'roomy';

const SPACING_CLASSES: Record<SettingsCardSpacing, string> = {
  regular: 'gap-4',
  roomy: 'gap-6',
};

@Component({
  selector: 'app-settings-card',
  templateUrl: './settings-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsCard {
  readonly title = input.required<string>();
  readonly spacing = input<SettingsCardSpacing>('regular');

  protected readonly spacingClasses = computed(() => SPACING_CLASSES[this.spacing()]);
}
