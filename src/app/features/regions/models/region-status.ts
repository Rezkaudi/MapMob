export type RegionStatus = 'active' | 'suspended';

/** The table pill reads "نشط" while the status field reads "نشطة", as in the design. */
export const REGION_STATUS_LABEL: Record<RegionStatus, string> = {
  active: 'نشط',
  suspended: 'معطلة',
};

export const REGION_STATUS_OPTION_LABEL: Record<RegionStatus, string> = {
  active: 'نشطة',
  suspended: 'معطلة',
};
