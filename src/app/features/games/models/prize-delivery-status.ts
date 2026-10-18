export type PrizeDeliveryStatus = 'delivered' | 'pending';

export const PRIZE_DELIVERY_LABELS: Record<PrizeDeliveryStatus, string> = {
  delivered: 'تم التسليم',
  pending: 'بانتظار التسليم',
};
