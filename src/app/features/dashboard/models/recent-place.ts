export type PlaceStatus = 'active' | 'suspended' | 'pending';

export const PLACE_STATUS_LABEL: Record<PlaceStatus, string> = {
  active: 'نشط',
  suspended: 'موقوف',
  pending: 'قيد المراجعة',
};

export interface RecentPlace {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly city: string;
  readonly rating: number;
  readonly status: PlaceStatus;
  readonly joinedAt: string;
  readonly logoUrl: string | null;
}
