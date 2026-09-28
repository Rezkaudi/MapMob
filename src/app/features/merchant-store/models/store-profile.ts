import { NamedReference } from './named-reference';
import { StoreContact } from './store-contact';
import { StoreLocation } from './store-location';
import { StoreWorkingDay } from './store-working-day';

/** The merchant's own place, as the "بيانات المتجر" page shows it. */
export interface StoreProfile {
  readonly name: string;
  readonly description: string | null;
  readonly coverImageUrl: string | null;
  readonly mainCategory: NamedReference;
  readonly subCategory: NamedReference | null;
  readonly contact: StoreContact;
  readonly location: StoreLocation;
  readonly isOpen24Hours: boolean;
  readonly workingHours: readonly StoreWorkingDay[];
}
