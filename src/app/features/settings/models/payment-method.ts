import { ActivationStatus } from '../../../shared/models/activation-status';
import { PaymentMethodKind } from './payment-method-kind';

export interface PaymentMethod {
  readonly id: string;
  readonly name: string;
  readonly kind: PaymentMethodKind;
  readonly status: ActivationStatus;
}
