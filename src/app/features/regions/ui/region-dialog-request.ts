import { RegionConfirmAction } from '../models/region-confirm-action';
import { RegionEntry } from '../models/region-entry';
import { RegionFormMode } from '../models/region-form-mode';

export type RegionDialogRequest =
  | {
      readonly type: 'form';
      readonly mode: RegionFormMode;
      readonly entry: RegionEntry | null;
    }
  | {
      readonly type: 'confirm';
      readonly action: RegionConfirmAction;
      readonly entry: RegionEntry;
    };
