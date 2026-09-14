import { RegionStatus } from './region-status';

/** The row both tables draw: a governorate counts its areas, an area its neighbourhoods. */
export interface RegionEntry {
  readonly id: string;
  readonly name: string;
  readonly subAreaCount: number;
  readonly placeCount: number;
  readonly status: RegionStatus;
  readonly updatedAt: string;
}
