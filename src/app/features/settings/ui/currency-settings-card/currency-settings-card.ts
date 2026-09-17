import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { touchedError } from '../../../../shared/forms/touched-error';
import { CurrencySettings } from '../../models/currency-settings';
import { CURRENCY_CHOICES, DECIMAL_PLACE_CHOICES } from '../../state/platform-setting-choices';
import { createCurrencySettingsFormGroup } from '../../state/platform-form-groups';
import { SettingsCard } from '../settings-card/settings-card';
import {
  SETTINGS_INPUT_CLASSES,
  SETTINGS_SELECT_CLASSES,
  SETTINGS_SUBMIT_BUTTON_CLASSES,
} from '../settings-control-classes';
import { SettingsField } from '../settings-field/settings-field';

@Component({
  selector: 'app-currency-settings-card',
  imports: [ReactiveFormsModule, SettingsCard, SettingsField],
  templateUrl: './currency-settings-card.html',
  host: { class: 'block' },
  // The symbol error reads the form's touched state, which signals do not track.
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CurrencySettingsCard {
  readonly currency = input.required<CurrencySettings>();
  readonly isSaving = input<boolean>(false);
  readonly saved = output<CurrencySettings>();

  protected readonly form = createCurrencySettingsFormGroup();
  protected readonly currencyChoices = CURRENCY_CHOICES;
  protected readonly decimalChoices = DECIMAL_PLACE_CHOICES;
  protected readonly inputClasses = SETTINGS_INPUT_CLASSES;
  protected readonly selectClasses = SETTINGS_SELECT_CLASSES;
  protected readonly submitButtonClasses = SETTINGS_SUBMIT_BUTTON_CLASSES;

  constructor() {
    effect(() => this.form.reset(this.currency()));
  }

  protected get symbolError(): string | null {
    return touchedError(this.form.controls.currencySymbol, 'اكتب رمز العملة');
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({ ...value, currencySymbol: value.currencySymbol.trim() });
  }
}
