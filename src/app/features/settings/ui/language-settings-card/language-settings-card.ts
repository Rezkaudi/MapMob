import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageSettings } from '../../models/language-settings';
import { LANGUAGE_CHOICES } from '../../state/platform-setting-choices';
import { createLanguageSettingsFormGroup } from '../../state/platform-form-groups';
import { SettingsCard } from '../settings-card/settings-card';
import {
  SETTINGS_SELECT_CLASSES,
  SETTINGS_SUBMIT_BUTTON_CLASSES,
} from '../settings-control-classes';
import { SettingsField } from '../settings-field/settings-field';

@Component({
  selector: 'app-language-settings-card',
  imports: [ReactiveFormsModule, SettingsCard, SettingsField],
  templateUrl: './language-settings-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSettingsCard {
  readonly language = input.required<LanguageSettings>();
  readonly isSaving = input<boolean>(false);
  readonly saved = output<LanguageSettings>();

  protected readonly form = createLanguageSettingsFormGroup();
  protected readonly languageChoices = LANGUAGE_CHOICES;
  protected readonly selectClasses = SETTINGS_SELECT_CLASSES;
  protected readonly submitButtonClasses = SETTINGS_SUBMIT_BUTTON_CLASSES;

  constructor() {
    effect(() => this.form.reset(this.language()));
  }

  protected submit(): void {
    this.saved.emit(this.form.getRawValue());
  }
}
