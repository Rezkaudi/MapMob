import { DeliveryPlatform } from '../../../../shared/models/delivery-platform';

/** The form still lists its choices locally; GET /places/form-options will replace these. */
export const CATEGORY_OPTIONS: readonly string[] = [
  'صيدلية',
  'مطعم',
  'مقهى',
  'سوبر ماركت',
  'عيادة',
];
export const CITY_OPTIONS: readonly string[] = ['الرياض', 'جدة', 'الدمام', 'طرطوس'];
export const REGION_OPTIONS: readonly string[] = ['المركز', 'الشمال', 'الجنوب', 'الشرق', 'الغرب'];

/** The ordering apps a new place can be linked to, in the order the frame lists them. */
export const DELIVERY_PLATFORM_OPTIONS: readonly DeliveryPlatform[] = [
  { id: '3', name: 'طلبات', latinName: 'Talabat', logoUrl: null },
  { id: '1', name: 'بي أوردر', latinName: 'BeeOrder', logoUrl: null },
  { id: '2', name: 'يلا غو دليفري', latinName: 'YallaGo', logoUrl: null },
];
