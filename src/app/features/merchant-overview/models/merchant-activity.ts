import { MerchantActivityKind } from './merchant-activity-kind';

export interface MerchantActivity {
  readonly id: string;
  readonly kind: MerchantActivityKind;
  /** Written by the backend, already in Arabic. */
  readonly message: string;
  readonly occurredAt: string;
}
