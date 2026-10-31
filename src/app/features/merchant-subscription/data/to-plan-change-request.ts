import { PlanChangeRequest } from '../models/plan-change-request';
import { LiveOwnerPlanRequest } from './live-owner-plan-request';
import { toPlanChangeKind } from './live-plan-request-type';
import { toBillingCycle } from './to-subscription-record';

const PENDING = 'pending';

export function isPendingRequest(request: LiveOwnerPlanRequest): boolean {
  return request.status === PENDING;
}

export function toPlanChangeRequest(request: LiveOwnerPlanRequest): PlanChangeRequest {
  return {
    id: String(request.id),
    kind: toPlanChangeKind(request.requestType),
    plan: { id: String(request.plan.id), name: request.plan.name },
    term: toBillingCycle(request.plan.billingCycle),
    status: 'pending',
    createdAt: request.createdAt,
  };
}
