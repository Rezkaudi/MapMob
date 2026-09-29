import { BillingCycle } from '../../../shared/models/billing-cycle';
import { PlanTier } from '../../../shared/models/plan-tier';
import { TERM_ADVERB } from './term-words';

/** The words each tier's card carries around its price. */
interface PlanTierPitch {
  readonly eyebrow: string;
  readonly priceNote: (cycle: BillingCycle) => string;
}

export const PLAN_TIER_PITCH: Record<PlanTier, PlanTierPitch> = {
  free: { eyebrow: 'بداية تجريبية', priceNote: () => 'مجانية دائماً بدون رسوم دورية' },
  basic: {
    eyebrow: 'الأكثر ملاءمة',
    priceNote: (cycle) => `تجدد ${TERM_ADVERB[cycle]} بالدفع النقدي المعتمد`,
  },
  featured: { eyebrow: 'أقصى وصول وتأثير', priceNote: () => 'تتضمن دعم فني مخصص وأولوية ترويج' },
};
