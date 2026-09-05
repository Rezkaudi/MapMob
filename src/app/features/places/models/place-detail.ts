import { PlaceActivity } from './place-activity';
import { PlaceContact } from './place-contact';
import { PlaceLocation } from './place-location';
import { PlaceOwner } from './place-owner';
import { PlaceStatus } from './place-status';
import { PlaceSubscription } from './place-subscription';
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
  readonly isOpenNow: boolean;
}
