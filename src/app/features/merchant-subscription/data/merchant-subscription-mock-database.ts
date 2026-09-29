import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanChangeDraft } from '../models/plan-change-draft';
import { PlanChangeRequest } from '../models/plan-change-request';
import { buildMerchantSubscriptionSeed } from './merchant-subscription-mock-seed';

const ALREADY_WAITING_MESSAGE = 'لديك طلب قيد المراجعة بالفعل.';
const UNKNOWN_PLAN_MESSAGE = 'هذه الباقة غير متاحة.';

/** The in-memory subscription behind the mock repository, loaded on first use. */
export class MerchantSubscriptionMockDatabase {
  private overview: MerchantSubscriptionOverview = buildMerchantSubscriptionSeed();
  private nextIdNumber = 1;

  constructor(private readonly now: () => Date) {}

  readOverview(): MerchantSubscriptionOverview {
    return this.overview;
  }

  /** The admin applies a request after the cash is paid, so the mock only keeps it waiting. */
  addRequest(draft: PlanChangeDraft): PlanChangeRequest {
    if (this.overview.pendingRequest) {
      throw new Error(ALREADY_WAITING_MESSAGE);
    }
    const plan = this.overview.plans.find((candidate) => candidate.id === draft.planId);
    if (!plan) {
      throw new Error(UNKNOWN_PLAN_MESSAGE);
    }
    const request: PlanChangeRequest = {
      id: `request-${this.nextIdNumber++}`,
      kind: draft.kind,
      plan: { id: plan.id, name: plan.name },
      term: draft.term,
      status: 'pending',
      createdAt: this.now().toISOString(),
    };
    this.overview = { ...this.overview, pendingRequest: request };
    return request;
  }
}
