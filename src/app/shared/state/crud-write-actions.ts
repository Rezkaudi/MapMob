import { ConfirmWriteActions } from './confirm-write-actions';

/** The store calls a list page wires into its dialogs. Each resolves `true` once saved. */
export interface CrudWriteActions<TDraft> extends ConfirmWriteActions {
  create(draft: TDraft): Promise<boolean>;
  update(id: string, draft: TDraft): Promise<boolean>;
}
