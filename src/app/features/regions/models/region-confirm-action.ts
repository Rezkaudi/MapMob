import { RegionStatus } from './region-status';

export type RegionConfirmAction = 'activate' | 'suspend' | 'delete';

type RegionStatusChangeAction = Exclude<RegionConfirmAction, 'delete'>;

const STATUS_AFTER: Record<RegionStatusChangeAction, RegionStatus> = {
  activate: 'active',
  suspend: 'suspended',
};

export function statusChangeActionFor(status: RegionStatus): RegionStatusChangeAction {
  return status === 'active' ? 'suspend' : 'activate';
}

export function statusAfter(action: RegionStatusChangeAction): RegionStatus {
  return STATUS_AFTER[action];
}
