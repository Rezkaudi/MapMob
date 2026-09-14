import { RegionStatus } from './region-status';

export interface RegionDraft {
  readonly name: string;
  readonly status: RegionStatus;
}
