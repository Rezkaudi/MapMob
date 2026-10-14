import { DeliveryPlatform } from '../../../shared/models/delivery-platform';

/** The ordering apps a new place can be linked to, in the order the frame lists them. */
export const KNOWN_DELIVERY_PLATFORMS: readonly DeliveryPlatform[] = [
  { id: '3', name: 'طلبات', latinName: 'Talabat', logoUrl: null },
  { id: '1', name: 'بي أوردر', latinName: 'BeeOrder', logoUrl: null },
  { id: '2', name: 'يلا غو دليفري', latinName: 'YallaGo', logoUrl: null },
];
