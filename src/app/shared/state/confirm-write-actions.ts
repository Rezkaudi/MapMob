import { ActivationStatus } from '../models/activation-status';

/** The store calls behind the status and delete dialogs. Each resolves `true` once saved. */
export interface ConfirmWriteActions {
  changeStatus(id: string, status: ActivationStatus): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}
