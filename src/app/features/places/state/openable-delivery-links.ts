import { DeliveryLink } from '../../../shared/models/delivery-link';

/** The detail page shows a platform only when it is switched on and has a link to open. */
export function listOpenableDeliveryLinks(links: readonly DeliveryLink[]): DeliveryLink[] {
  return links.filter((link) => link.isEnabled && Boolean(link.storeUrl?.trim()));
}
