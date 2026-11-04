import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { WEB_ADDRESS_MESSAGE } from '../../../../shared/forms/contact-validators';
import { touchedError } from '../../../../shared/forms/touched-error';
import { PlatformGeneralDraft } from '../../models/platform-general-draft';
import { PlatformGeneralSettings } from '../../models/platform-general-settings';
import { createPlatformGeneralFormGroup } from '../../state/platform-form-groups';
import { SettingsCard } from '../settings-card/settings-card';
import {
  SETTINGS_INPUT_CLASSES,
  SETTINGS_SUBMIT_BUTTON_CLASSES,
} from '../settings-control-classes';
import { SettingsField } from '../settings-field/settings-field';
import { BusyLabel } from '../../../../shared/ui/busy-label/busy-label';

const MESSAGES = {
  appName: 'اكتب اسم التطبيق',
  supportEmail: 'اكتب بريداً إلكترونياً صحيحاً',
  supportPhone: 'اكتب رقم هاتف صحيحاً',
  ownerApplicationUrl: WEB_ADDRESS_MESSAGE,
};

type GeneralField = keyof typeof MESSAGES;

@Component({
  selector: 'app-platform-general-card',
  imports: [ReactiveFormsModule, SettingsCard, SettingsField, BusyLabel],
  templateUrl: './platform-general-card.html',
  host: { class: 'block' },
  // Field errors read the form's touched state, which signals do not track.
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PlatformGeneralCard {
  readonly general = input.required<PlatformGeneralSettings>();
  readonly isSaving = input<boolean>(false);
  readonly saved = output<PlatformGeneralDraft>();

  protected readonly form = createPlatformGeneralFormGroup();
  protected readonly inputClasses = SETTINGS_INPUT_CLASSES;
  protected readonly submitButtonClasses = SETTINGS_SUBMIT_BUTTON_CLASSES;
  private readonly pickedLogo = signal<File | null>(null);
  protected readonly logoFileName = computed(
    () => this.pickedLogo()?.name ?? this.general().logoFileName,
  );

  constructor() {
    effect(() => {
      const { appName, supportEmail, supportPhone, ownerApplicationUrl } = this.general();
      this.form.reset({
        appName,
        supportEmail,
        supportPhone,
        ownerApplicationUrl: ownerApplicationUrl ?? '',
      });
      this.pickedLogo.set(null);
    });
  }

  protected fieldError(field: GeneralField): string | null {
    return touchedError(this.form.controls[field], MESSAGES[field]);
  }

  protected pickLogo(event: Event): void {
    const [logo] = Array.from((event.target as HTMLInputElement).files ?? []);
    if (logo) {
      this.pickedLogo.set(logo);
    }
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const { appName, supportEmail, supportPhone, ownerApplicationUrl } = this.form.getRawValue();
    this.saved.emit({
      appName: appName.trim(),
      supportEmail: supportEmail.trim(),
      supportPhone: supportPhone.trim(),
      ownerApplicationUrl: ownerApplicationUrl.trim() || null,
      logo: this.pickedLogo(),
    });
  }
}
