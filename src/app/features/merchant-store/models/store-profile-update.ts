import { StoreContact } from './store-contact';
import { StoreWorkingDay } from './store-working-day';

/** What the save button sends. The categories, governorate and area are not the owner's to change. */
export interface StoreProfileUpdate extends StoreContact {
  readonly name: string;
  readonly description: string | null;
  readonly address: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly isOpen24Hours: boolean;
  readonly workingHours: readonly StoreWorkingDay[];
  /** A newly picked cover; `null` keeps the saved one. */
  readonly cover: File | null;
}
