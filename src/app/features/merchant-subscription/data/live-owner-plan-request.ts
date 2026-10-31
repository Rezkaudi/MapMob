import { LiveOwnerPlan } from './live-owner-plan';

/** A row of `requests` in GET /owner/subscription, and the answer of POST …/requests. */
export interface LiveOwnerPlanRequest {
  readonly id: string;
  readonly requestType: string;
  readonly plan: LiveOwnerPlan;
  readonly status: string;
  readonly createdAt: string;
}
