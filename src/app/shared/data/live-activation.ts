import { ActivationStatus } from '../models/activation-status';

/** The live server keeps on/off as `is_active`. */
export function toActivationStatus(isActive: boolean): ActivationStatus {
  return isActive ? 'active' : 'suspended';
}

export function isActiveStatus(status: ActivationStatus): boolean {
  return status === 'active';
}
