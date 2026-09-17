import { ActivationStatus } from '../../../shared/models/activation-status';
import { PaymentMethodKind } from '../models/payment-method-kind';
import { SettingsChoice } from '../models/settings-choice';

export const PAYMENT_METHOD_KIND_CHOICES: readonly SettingsChoice<PaymentMethodKind>[] = [
  { value: 'manual', label: 'يدوي' },
  { value: 'electronic', label: 'إلكتروني' },
];

export const ACTIVATION_STATUS_CHOICES: readonly SettingsChoice<ActivationStatus>[] = [
  { value: 'active', label: 'نشط' },
  { value: 'suspended', label: 'معطل' },
];

export const PAYMENT_METHOD_KIND_LABELS: Record<PaymentMethodKind, string> = {
  manual: 'يدوي',
  electronic: 'إلكتروني',
};

export const ACTIVATION_STATUS_LABELS: Record<ActivationStatus, string> = {
  active: 'نشط',
  suspended: 'معطل',
};
