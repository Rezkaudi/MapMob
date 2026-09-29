import { ActivationStatus } from '../../../shared/models/activation-status';

export type DeliveryPlatformStatus = ActivationStatus;

export const DELIVERY_PLATFORM_STATUS_LABEL: Record<DeliveryPlatformStatus, string> = {
  active: 'نشط',
  suspended: 'معطل',
};
