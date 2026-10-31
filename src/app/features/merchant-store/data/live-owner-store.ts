import { LiveOptionalText } from '../../../shared/data/arabic-text-of';
import { NamedReference } from '../../../shared/models/named-reference';
import { LiveOwnerDeliveryLink } from './live-owner-delivery-link';
import { LiveOwnerSocialLink } from './live-owner-social-link';
import { LiveOwnerWorkingDay } from './live-owner-working-day';

/** GET /owner/store, only the fields the store page reads. */
export interface LiveOwnerStore {
  readonly name: LiveOptionalText;
  readonly description: LiveOptionalText;
  readonly publicUrl: string;
  readonly coverImageUrl: string | null;
  readonly contact: {
    readonly phone: string | null;
    readonly whatsapp: string | null;
    readonly email: string | null;
    readonly website: string | null;
  };
  readonly mainCategory: NamedReference;
  readonly subCategory: NamedReference | null;
  readonly region: NamedReference;
  readonly city: NamedReference;
  readonly address: LiveOptionalText;
  readonly latitude: number;
  readonly longitude: number;
  readonly workingHours: readonly LiveOwnerWorkingDay[];
  readonly socialLinks: readonly LiveOwnerSocialLink[];
  readonly deliveryLinks: readonly LiveOwnerDeliveryLink[];
}
