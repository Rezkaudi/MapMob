import { Observable } from 'rxjs';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanChangeDraft } from '../models/plan-change-draft';
import { PlanChangeRequest } from '../models/plan-change-request';

export abstract class MerchantSubscriptionRepository {
  abstract getOverview(): Observable<MerchantSubscriptionOverview>;
  abstract requestPlanChange(draft: PlanChangeDraft): Observable<PlanChangeRequest>;
}
