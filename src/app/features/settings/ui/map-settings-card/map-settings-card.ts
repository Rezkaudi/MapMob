import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { touchedError } from '../../../../shared/forms/touched-error';
import { MapSettings } from '../../models/map-settings';
import {
  DISTANCE_UNIT_CHOICES,
  DISTANCE_UNIT_SHORT_LABELS,
} from '../../state/platform-setting-choices';
import { MAX_SEARCH_RADIUS_KM, createMapSettingsFormGroup } from '../../state/platform-form-groups';
import { SettingsCard } from '../settings-card/settings-card';
import {
  SETTINGS_SELECT_CLASSES,
  SETTINGS_SUBMIT_BUTTON_CLASSES,
} from '../settings-control-classes';
import { SettingsField } from '../settings-field/settings-field';

@Component({
  selector: 'app-map-settings-card',
  imports: [ReactiveFormsModule, SettingsCard, SettingsField],
  templateUrl: './map-settings-card.html',
  host: { class: 'block' },
  // The radius error reads the form's touched state, which signals do not track.
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MapSettingsCard {
  readonly map = input.required<MapSettings>();
  readonly isSaving = input<boolean>(false);
  readonly saved = output<MapSettings>();

  protected readonly form = createMapSettingsFormGroup();
  protected readonly unitChoices = DISTANCE_UNIT_CHOICES;
  protected readonly maxRadius = MAX_SEARCH_RADIUS_KM;
  protected readonly selectClasses = SETTINGS_SELECT_CLASSES;
  protected readonly submitButtonClasses = SETTINGS_SUBMIT_BUTTON_CLASSES;
  private readonly distanceUnit = toSignal(this.form.controls.distanceUnit.valueChanges, {
    initialValue: this.form.controls.distanceUnit.value,
  });
  protected readonly radiusUnitLabel = computed(
    () => DISTANCE_UNIT_SHORT_LABELS[this.distanceUnit()],
  );

  constructor() {
    effect(() => this.form.reset(this.map()));
  }

  protected get radiusError(): string | null {
    return touchedError(
      this.form.controls.searchRadiusKm,
      `اكتب رقماً صحيحاً من 1 إلى ${MAX_SEARCH_RADIUS_KM}`,
    );
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.saved.emit(this.form.getRawValue());
  }
}
