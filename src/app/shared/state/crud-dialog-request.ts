import { ConfirmAction } from '../models/confirm-action';
import { FormMode } from '../models/form-mode';
import { CrudEntry } from './crud-entry';

export type CrudDialogRequest<TEntry extends CrudEntry> =
  | {
      readonly type: 'form';
      readonly mode: FormMode;
      readonly entry: TEntry | null;
    }
  | {
      readonly type: 'confirm';
      readonly action: ConfirmAction;
      readonly entry: TEntry;
    };
