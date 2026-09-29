import { PlanTier } from '../../../../shared/models/plan-tier';
import { PlanActionKind } from '../../models/plan-action';
import { PlanFeatureListTone } from '../plan-feature-list/plan-feature-list';

/** Every colour a plan card changes by tier. The geometry is the same for all three. */
export interface PlanOfferSkin {
  /** The background; the border depends on whether the plan is the current one. */
  readonly card: string;
  readonly eyebrow: string;
  readonly name: string;
  readonly tagline: string;
  readonly amount: string;
  readonly unit: string;
  readonly priceDivider: string;
  readonly limitsBox: string;
  readonly limitLabel: string;
  readonly limitValue: string;
  readonly featureTone: PlanFeatureListTone;
  readonly isInverse: boolean;
}

const WHITE_CARD = {
  card: 'bg-surface',
  name: 'text-text-primary',
  tagline: 'text-text-secondary',
  amount: 'text-text-primary',
  unit: 'text-text-secondary',
  priceDivider: 'border-border',
  limitsBox: 'w-full bg-surface-muted',
  limitLabel: 'text-text-secondary',
  limitValue: 'text-text-primary',
  featureTone: 'plain',
  isInverse: false,
} as const;

export const PLAN_OFFER_SKINS: Record<PlanTier, PlanOfferSkin> = {
  free: { ...WHITE_CARD, eyebrow: 'text-text-secondary' },
  basic: { ...WHITE_CARD, eyebrow: 'tracking-[0.7px] text-primary' },
  featured: {
    card: 'bg-linear-to-b from-[#0583EC] to-[#0359A0]',
    eyebrow: 'tracking-[0.7px] text-[#FCD34D]',
    name: 'text-white',
    tagline: 'text-[#DBEAFE]',
    amount: 'text-white',
    unit: 'text-[#BFDBFE]',
    priceDivider: 'border-white/20',
    // The frame draws this box 9px narrower than the column, against its left edge.
    limitsBox: 'w-full max-w-[278px] self-end bg-white/10 backdrop-blur-[4px]',
    limitLabel: 'text-[#EFF6FF]',
    limitValue: 'text-white',
    featureTone: 'inverse',
    isInverse: true,
  },
};

const PLAIN_BORDER = 'border border-border';
/** The current plan's card trades its thin border for a 2px blue one. */
const CURRENT_BORDER = 'border-2 border-primary';

export function pickPlanCardBorder(isCurrent: boolean): string {
  return isCurrent ? CURRENT_BORDER : PLAIN_BORDER;
}

const RAISED_SHADOW = 'shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]';
const SOLID = 'bg-primary text-white hover:bg-primary-hover';
const ON_BLUE = `bg-surface text-primary ${RAISED_SHADOW}`;
const SETTLED = 'border border-primary/20 bg-primary/10 text-primary';

/** The foot button by what it does; `inverse` is its look on the blue card. */
export function pickPlanActionClasses(kind: PlanActionKind, isInverse: boolean): string {
  switch (kind) {
    case 'upgrade':
    case 'renewal':
      return isInverse ? ON_BLUE : SOLID;
    case 'downgrade':
      return 'border border-text-secondary text-text-primary hover:bg-surface-muted';
    default:
      return SETTLED;
  }
}
