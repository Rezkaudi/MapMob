export type RegionStatus = 'active' | 'suspended';

export const REGION_STATUS_LABEL: Record<RegionStatus, string> = {
  active: 'نشط',
  suspended: 'معطلة',
};
