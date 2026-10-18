export type PrizeKind = 'cash' | 'voucher';

/** The short name the detail modal writes under "نوع الجائزة". */
export const PRIZE_KIND_LABELS: Record<PrizeKind, string> = {
  cash: 'جائزة مالية',
  voucher: 'قسيمة شرائية',
};
