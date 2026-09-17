import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** A field icon sits 12px from the left edge; a select's chevron sits 16px in. */
export type SettingsFieldIconPlacement = 'field' | 'chevron';

const ICON_PLACEMENT_CLASSES: Record<SettingsFieldIconPlacement, string> = {
  field: 'left-3',
  chevron: 'left-4',
};

/** A 12px label over a grey settings control, with an optional icon on the left edge. */
@Component({
  selector: 'app-settings-field',
  imports: [AppIcon],
  templateUrl: './settings-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsField {
  readonly label = input.required<string>();
  readonly fieldId = input.required<string>();
  readonly icon = input<string | null>(null);
  readonly iconPlacement = input<SettingsFieldIconPlacement>('field');
  readonly error = input<string | null>(null);

  protected readonly iconPlacementClasses = computed(
    () => ICON_PLACEMENT_CLASSES[this.iconPlacement()],
  );
}
