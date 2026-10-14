import { LivePlan } from '../../../shared/data/live-plan';

export interface LiveSubscription {
  readonly id: number;
  readonly store: { readonly id: number; readonly name: string };
  readonly plan: LivePlan;
  readonly starts_at: string;
  readonly ends_at: string;
  readonly status: string;
  readonly auto_renew: boolean;
  readonly created_at: string;
}
