import { ChangeDetectionStrategy, Component, OnInit, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { contactEmail } from '../../../../shared/forms/contact-validators';
import { hasText } from '../../../../shared/forms/has-text';
import { touchedError } from '../../../../shared/forms/touched-error';
import { AdminInvitation } from '../../models/admin-invitation';
import { AdminRole } from '../../models/admin-role';
import {
  SETTINGS_DIALOG_INPUT_CLASSES,
  SETTINGS_DIALOG_SELECT_CLASSES,
} from '../settings-control-classes';
import { SettingsDialogField } from '../settings-dialog-field/settings-dialog-field';
import { SettingsDialogFrame } from '../settings-dialog-frame/settings-dialog-frame';

const MESSAGES = {
  fullName: 'اكتب اسم المشرف بالكامل',
  email: 'اكتب بريداً إلكترونياً صحيحاً',
  roleId: 'اختر دور المشرف',
};

type InvitationField = keyof typeof MESSAGES;

@Component({
  selector: 'app-admin-invite-dialog',
  imports: [ReactiveFormsModule, SettingsDialogField, SettingsDialogFrame],
  templateUrl: './admin-invite-dialog.html',
  // Field errors read the form's touched state, which signals do not track.
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AdminInviteDialog implements OnInit {
  readonly roles = input.required<readonly AdminRole[]>();
  readonly suggestedRoleId = input<string | null>(null);
  readonly isBusy = input<boolean>(false);
  readonly saveError = input<string | null>(null);
  readonly invited = output<AdminInvitation>();
  readonly closed = output<void>();

  protected readonly form = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, hasText],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, contactEmail],
    }),
    roleId: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  protected readonly inputClasses = SETTINGS_DIALOG_INPUT_CLASSES;
  protected readonly selectClasses = SETTINGS_DIALOG_SELECT_CLASSES;

  ngOnInit(): void {
    this.form.controls.roleId.setValue(this.suggestedRoleId() ?? '');
  }

  protected fieldError(field: InvitationField): string | null {
    return touchedError(this.form.controls[field], MESSAGES[field]);
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const { fullName, email, roleId } = this.form.getRawValue();
    this.invited.emit({ fullName: fullName.trim(), email: email.trim(), roleId });
  }
}
