import { PlacePackage } from './place-package';
import { PlaceStatus } from './place-status';

export interface PlaceSubscription {
  readonly package: PlacePackage;
  readonly status: PlaceStatus;
  readonly renewsAt: string;
}
