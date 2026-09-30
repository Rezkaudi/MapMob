import { PlacePackage } from './place-package';
import { PlaceStatus } from './place-status';

export interface Place {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  /** The place's public page on MapMob; the row menu shows its QR code. */
  readonly publicUrl: string;
  readonly logoUrl: string;
  readonly category: string;
  readonly city: string;
  readonly rating: number;
  readonly status: PlaceStatus;
  readonly package: PlacePackage;
  readonly joinedAt: string;
}
