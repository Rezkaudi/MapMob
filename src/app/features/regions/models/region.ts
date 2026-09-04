import { RegionStatus } from './region-status';

export interface Region {
  readonly id: string;
  readonly name: string;
  readonly districtCount: number;
  readonly placeCount: number;
  readonly status: RegionStatus;
  readonly updatedAt: string;
}
