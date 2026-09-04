export type PlaceStatus = 'active' | 'suspended' | 'pending';

export const PLACE_STATUS_LABEL: Record<PlaceStatus, string> = {
  active: 'نشط',
  suspended: 'موقوف',
  pending: 'قيد المراجعة',
};
