import { ActivationStatus } from '../../../shared/models/activation-status';

export type RegionStatus = ActivationStatus;

/** The table pill reads "نشط" while the status field reads "نشطة", as in the design. */
export const REGION_STATUS_LABEL: Record<RegionStatus, string> = {
  active: 'نشط',
  suspended: 'معطلة',
};

export const REGION_STATUS_OPTION_LABEL: Record<RegionStatus, string> = {
  active: 'نشطة',
  suspended: 'معطلة',
};
