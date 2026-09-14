import { RegionDraft } from '../models/region-draft';
import { RegionStatus } from '../models/region-status';

/** The store calls a region page wires into its dialogs. Each resolves `true` once saved. */
export interface RegionWriteActions {
  create(draft: RegionDraft): Promise<boolean>;
  update(id: string, draft: RegionDraft): Promise<boolean>;
  changeStatus(id: string, status: RegionStatus): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}
