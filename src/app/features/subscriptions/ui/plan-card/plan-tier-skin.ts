import { ActionMenuTriggerTone } from '../../../../shared/ui/action-menu/action-menu';
import { PlanTier } from '../../models/plan-tier';

/** Every colour the card changes between tiers. The geometry is the same for all three. */
export interface PlanTierSkin {
  /** Classes for the grid cell itself: the featured tier overhangs the row it sits in. */
  readonly host: string;
  readonly card: string;
  readonly tile: string;
  readonly tileIcon: string;
  readonly tileIconName: string;
  readonly tileIconSize: number;
  readonly badge: string;
  readonly name: string;
  readonly tagline: string;
  readonly amount: string;
  readonly unit: string;
  readonly priceDivider: string;
  readonly limitsBox: string;
  readonly limitLabel: string;
  readonly limitValue: string;
  readonly feature: string;
  readonly callToAction: string;
  readonly menuTone: ActionMenuTriggerTone;
}

/** Figma strokes sit inside the box, so these are outlines — a border would add height. */
const PLAIN_CARD =
  'outline-1 -outline-offset-1 outline-border bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]';
const PLAIN_LIMITS = 'bg-surface-muted';

export const PLAN_TIER_SKINS: Record<PlanTier, PlanTierSkin> = {
  featured: {
    host: 'block -mt-[11px] -mb-[3px]',
    card: 'outline-2 -outline-offset-2 outline-primary bg-linear-to-b from-[#0583EC] to-[#0359A0]',
    tile: 'bg-white/20 backdrop-blur-[4px]',
    tileIcon: 'text-[#FCD34D]',
    tileIconName: 'star-award',
    tileIconSize: 20,
    badge: 'bg-[#FBBF24] font-extrabold text-text-primary',
    name: 'text-white',
    tagline: 'text-[#DBEAFE]',
    amount: 'font-black text-white',
    unit: 'text-[#BFDBFE]',
    priceDivider: 'border-white/20',
    limitsBox: 'bg-white/10 backdrop-blur-[4px]',
    limitLabel: 'text-[#EFF6FF]',
    limitValue: 'text-white',
    feature: 'text-[#EFF6FF]',
    callToAction:
      'bg-surface font-bold text-primary shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]',
    menuTone: 'inverse',
  },
  basic: {
    host: 'block',
    card: PLAIN_CARD,
    tile: 'bg-[#EFF6FF]',
    tileIcon: 'text-primary',
    tileIconName: 'bolt',
    tileIconSize: 20,
    badge: 'bg-primary/16 font-bold text-primary',
    name: 'text-text-primary',
    tagline: 'text-text-secondary',
    amount: 'font-bold text-text-primary',
    unit: 'text-text-secondary',
    priceDivider: 'border-[#F1F5F9]',
    limitsBox: PLAIN_LIMITS,
    limitLabel: 'text-text-secondary',
    limitValue: 'text-text-primary',
    feature: 'text-text-primary',
    callToAction:
      'bg-primary font-bold text-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]',
    menuTone: 'default',
  },
  free: {
    host: 'block',
    card: PLAIN_CARD,
    tile: 'bg-[#F1F5F9]',
    tileIcon: 'text-text-secondary',
    tileIconName: 'package',
    tileIconSize: 24,
    badge: 'bg-status-success/16 font-bold text-status-success',
    name: 'text-text-primary',
    tagline: 'text-text-secondary',
    amount: 'font-bold text-text-primary',
    unit: 'text-text-secondary',
    priceDivider: 'border-[#F1F5F9]',
    limitsBox: PLAIN_LIMITS,
    limitLabel: 'text-text-secondary',
    limitValue: 'text-text-primary',
    feature: 'text-text-primary',
    callToAction:
      'outline-1 -outline-offset-1 outline-text-secondary font-bold text-text-primary',
    menuTone: 'default',
  },
};
