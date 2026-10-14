import { LiveDeliveryPlatform } from '../../../shared/data/live-delivery-platform';
import { LiveStoreDeliveryLink } from '../../../shared/data/live-store-delivery-link';
import { isActiveStatus, toActivationStatus } from '../../../shared/data/live-activation';
import { NamedReference } from '../../../shared/models/named-reference';
import { DeliveryPlatformDraft } from '../models/delivery-platform-draft';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';
import { LinkedStore } from '../models/linked-store';
import { LiveDeliveryPlatformSummary } from './live-delivery-platform-summary';
import { LiveLinkedStore } from './live-linked-store';

const NO_SORT_ORDER = 0;
const MISSING_REFERENCE: NamedReference = { id: '', name: '—' };

/** The server keeps no web address and counts no stores or referrals. */
export function toDeliveryPlatformEntry(live: LiveDeliveryPlatform): DeliveryPlatformEntry {
  return {
    id: String(live.id),
    name: live.name,
    latinName: live.name,
    logoUrl: live.logo,
    websiteUrl: '',
    linkedStoreCount: null,
    referralCount: null,
    status: toActivationStatus(live.is_active),
    sortOrder: live.sort_order ?? NO_SORT_ORDER,
    createdAt: live.created_at,
  };
}

export function toDeliveryPlatformSummary(
  live: LiveDeliveryPlatformSummary,
): DeliveryPlatformSummary {
  return {
    referralCount: null,
    mostUsedPlatform: null,
    linkedStoreCount: null,
    activeCount: live.active,
    platformCount: live.total,
  };
}

/**
 * The server sends back only the English name, so the edit form opens with it in the Arabic box.
 * The Arabic name is sent only when the admin changed that box, so a saved one is never lost.
 */
export function toLiveDeliveryPlatformForm(
  draft: DeliveryPlatformDraft,
  saved: DeliveryPlatformEntry | null,
): FormData {
  const form = new FormData();
  if (saved) {
    form.set('_method', 'PUT');
  }
  if (!saved || draft.name !== saved.name) {
    form.set('name[ar]', draft.name);
  }
  form.set('name[en]', draft.latinName);
  form.set('is_active', isActiveStatus(draft.status) ? '1' : '0');
  form.set('sort_order', String(draft.sortOrder));
  if (draft.logoFile) {
    form.set('logo', draft.logoFile);
  }
  return form;
}

export function toLinkedStore(store: LiveLinkedStore, link: LiveStoreDeliveryLink): LinkedStore {
  return {
    id: store.id,
    name: store.name,
    logoUrl: store.logoUrl ?? null,
    category: store.mainCategory ?? MISSING_REFERENCE,
    governorate: store.location?.governorate ?? MISSING_REFERENCE,
    area: store.location?.area ?? null,
    storeUrl: link.url,
    linkedAt: link.createdAt,
  };
}
