import { ActivationStatus } from './activation-status';

export type ConfirmAction = 'activate' | 'suspend' | 'delete';

type StatusChangeAction = Exclude<ConfirmAction, 'delete'>;

const STATUS_AFTER: Record<StatusChangeAction, ActivationStatus> = {
  activate: 'active',
  suspend: 'suspended',
};

export function statusChangeActionFor(status: ActivationStatus): StatusChangeAction {
  return status === 'active' ? 'suspend' : 'activate';
}

export function statusAfter(action: StatusChangeAction): ActivationStatus {
  return STATUS_AFTER[action];
}
