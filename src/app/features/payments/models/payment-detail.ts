import { Payment } from './payment';

export interface PaymentCompany {
  readonly name: string;
  readonly type: string;
  readonly contactName: string;
  readonly contactPhone: string;
}

export interface PaymentSubscription {
  readonly planName: string;
  readonly cycle: string;
  readonly startsOn: string;
  readonly endsOn: string;
}

export interface PaymentDetail extends Payment {
  readonly company: PaymentCompany;
  readonly subscription: PaymentSubscription | null;
}
