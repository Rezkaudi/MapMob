import { PlanChangeKind } from '../models/plan-change-kind';

/** The words POST /owner/subscription/requests takes; a downgrade is "discount" there. */
const LIVE_REQUEST_TYPE: Readonly<Record<PlanChangeKind, string>> = {
  upgrade: 'upgrade',
  downgrade: 'discount',
  renewal: 'renewal',
};

export function toLiveRequestType(kind: PlanChangeKind): string {
  return LIVE_REQUEST_TYPE[kind];
}

export function toPlanChangeKind(requestType: string): PlanChangeKind {
  const entry = Object.entries(LIVE_REQUEST_TYPE).find(([, word]) => word === requestType);
  return (entry?.[0] as PlanChangeKind | undefined) ?? 'upgrade';
}
