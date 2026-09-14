import { ActivationStatus } from '../models/activation-status';

/** The store calls a list page wires into its dialogs. Each resolves `true` once saved. */
export interface CrudWriteActions<TDraft> {
  create(draft: TDraft): Promise<boolean>;
  update(id: string, draft: TDraft): Promise<boolean>;
  changeStatus(id: string, status: ActivationStatus): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}
