import { ChangeDetectionStrategy, Component, OnInit, computed, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { hasText } from '../../../../shared/forms/has-text';
import { touchedError } from '../../../../shared/forms/touched-error';
import { ActivationStatus } from '../../../../shared/models/activation-status';
import { PaymentMethodDialogState } from '../../models/payment-method-dialog-state';
import { PaymentMethodDraft } from '../../models/payment-method-draft';
import { PaymentMethodKind } from '../../models/payment-method-kind';
import {
  ACTIVATION_STATUS_CHOICES,
  PAYMENT_METHOD_KIND_CHOICES,
} from '../../state/payment-method-labels';
import {
  SETTINGS_DIALOG_INPUT_CLASSES,
  SETTINGS_DIALOG_SELECT_CLASSES,
} from '../settings-control-classes';
import { SettingsDialogField } from '../settings-dialog-field/settings-dialog-field';
import { SettingsDialogFrame } from '../settings-dialog-frame/settings-dialog-frame';
import { PAYMENT_METHOD_DIALOG_COPY } from './payment-method-dialog-copy';

@Component({
  selector: 'app-payment-method-dialog',
  imports: [ReactiveFormsModule, SettingsDialogField, SettingsDialogFrame],
  templateUrl: './payment-method-dialog.html',
  // The name error reads the form's touched state, which signals do not track.
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PaymentMethodDialog implements OnInit {
  readonly dialog = input.required<PaymentMethodDialogState>();
  readonly isBusy = input<boolean>(false);
  readonly saveError = input<string | null>(null);
  readonly saved = output<PaymentMethodDraft>();
  readonly closed = output<void>();

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, hasText] }),
    kind: new FormControl<PaymentMethodKind>('manual', { nonNullable: true }),
    status: new FormControl<ActivationStatus>('active', { nonNullable: true }),
  });
  protected readonly copy = computed(() => PAYMENT_METHOD_DIALOG_COPY[this.dialog().mode]);
  protected readonly kindChoices = PAYMENT_METHOD_KIND_CHOICES;
  protected readonly statusChoices = ACTIVATION_STATUS_CHOICES;
  protected readonly inputClasses = SETTINGS_DIALOG_INPUT_CLASSES;
  protected readonly selectClasses = SETTINGS_DIALOG_SELECT_CLASSES;

  ngOnInit(): void {
    const dialog = this.dialog();
    if (dialog.mode === 'edit') {
      const { name, kind, status } = dialog.method;
      this.form.setValue({ name, kind, status });
    }
  }

  protected get nameError(): string | null {
    return touchedError(this.form.controls.name, 'اكتب اسم وسيلة الدفع');
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({ ...value, name: value.name.trim() });
  }
}
