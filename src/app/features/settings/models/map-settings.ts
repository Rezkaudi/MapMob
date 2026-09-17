import { DistanceUnit } from './distance-unit';

export interface MapSettings {
  readonly distanceUnit: DistanceUnit;
  readonly searchRadiusKm: number;
}
