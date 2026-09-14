import { RegionEntry } from './region-entry';

export interface Area extends RegionEntry {
  readonly governorateId: string;
}
