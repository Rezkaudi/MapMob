import { PlaceActivity } from './place-activity';
import { PlaceContact } from './place-contact';
import { PlaceLocation } from './place-location';
import { PlaceOffer } from './place-offer';
import { PlaceOwner } from './place-owner';
import { PlaceProduct } from './place-product';
import { PlaceStatus } from './place-status';
import { PlaceSubscription } from './place-subscription';
import { PlaceVideo } from './place-video';
import { WorkingHoursRow } from './working-hours-row';

export interface PlaceDetail {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly status: PlaceStatus;
  readonly description: string;
  readonly mainCategory: string;
  readonly subCategory: string;
  readonly images: readonly string[];
  readonly owner: PlaceOwner;
  readonly subscription: PlaceSubscription;
  readonly activity: PlaceActivity;
  readonly contact: PlaceContact;
  readonly location: PlaceLocation;
  readonly workingHours: readonly WorkingHoursRow[];
  readonly products: readonly PlaceProduct[];
  readonly offers: readonly PlaceOffer[];
  readonly videos: readonly PlaceVideo[];
  readonly isOpenNow: boolean;
}
