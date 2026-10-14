import { DeliveryPlatform } from '../models/delivery-platform';
import { LiveDeliveryPlatform } from './live-delivery-platform';

/** The server sends one name, so it stands for both the Arabic and the Latin one. */
export function toDeliveryPlatform(live: LiveDeliveryPlatform): DeliveryPlatform {
  return { id: String(live.id), name: live.name, latinName: live.name, logoUrl: live.logo };
}
