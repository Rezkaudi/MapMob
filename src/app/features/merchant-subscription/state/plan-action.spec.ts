import { PlanChangeRequest } from '../models/plan-change-request';
import {
  BASIC_PLAN,
  CURRENT_RECORD,
  FEATURED_PLAN,
  FREE_PLAN,
  buildOverview,
} from '../testing/merchant-subscription-fixture';
import { choosePlanAction, findUpgradeTarget } from './plan-action';

const EARLY_IN_PERIOD = '2026-09-10';
const LAST_WEEK = '2026-09-29';

function pending(planId: string): PlanChangeRequest {
  return {
    id: 'request-1',
    kind: 'upgrade',
    plan: { id: planId, name: 'x' },
    term: 'monthly',
    status: 'pending',
    createdAt: '2026-09-10T08:00:00Z',
  };
}

describe('plan action', () => {
  const overview = buildOverview();

  it('marks the current plan as the active one, with nothing to press', () => {
    expect(choosePlanAction(BASIC_PLAN, overview, EARLY_IN_PERIOD)).toEqual({
      kind: 'current',
      label: 'باقتك الحالية النشطة',
      isDisabled: true,
    });
  });

  it('offers to renew the current paid plan in its last week', () => {
    expect(choosePlanAction(BASIC_PLAN, overview, LAST_WEEK)).toEqual({
      kind: 'renewal',
      label: 'تجديد الاشتراك',
      isDisabled: false,
    });
  });

  it('never offers to renew the free plan', () => {
    const onFree = buildOverview({
      current: { ...CURRENT_RECORD, plan: { id: FREE_PLAN.id, name: FREE_PLAN.name } },
    });

    expect(choosePlanAction(FREE_PLAN, onFree, LAST_WEEK).kind).toBe('current');
  });

  it('offers an upgrade on a dearer tier and a move on a cheaper one', () => {
    expect(choosePlanAction(FEATURED_PLAN, overview, EARLY_IN_PERIOD)).toEqual({
      kind: 'upgrade',
      label: 'ترقية الباقة الآن',
      isDisabled: false,
    });
    expect(choosePlanAction(FREE_PLAN, overview, EARLY_IN_PERIOD)).toEqual({
      kind: 'downgrade',
      label: 'اختيار الباقة المجانية',
      isDisabled: false,
    });
  });

  it('shows the requested plan as under review and locks the others', () => {
    const waiting = buildOverview({ pendingRequest: pending(FEATURED_PLAN.id) });

    expect(choosePlanAction(FEATURED_PLAN, waiting, EARLY_IN_PERIOD)).toEqual({
      kind: 'pending',
      label: 'طلبك قيد المراجعة',
      isDisabled: true,
    });
    expect(choosePlanAction(FREE_PLAN, waiting, EARLY_IN_PERIOD).isDisabled).toBe(true);
  });

  it('upgrades the hero to the next tier up, and to nothing from the top', () => {
    expect(findUpgradeTarget(overview)?.id).toBe(FEATURED_PLAN.id);

    const onTop = buildOverview({
      current: { ...CURRENT_RECORD, plan: { id: FEATURED_PLAN.id, name: FEATURED_PLAN.name } },
    });
    expect(findUpgradeTarget(onTop)).toBeNull();
  });
});
