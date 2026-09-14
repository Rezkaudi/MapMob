import { ActivationStatus } from '../../../shared/models/activation-status';

export type CategoryStatus = ActivationStatus;

export const CATEGORY_STATUS_LABEL: Record<CategoryStatus, string> = {
  active: 'نشط',
  suspended: 'معطل',
};
