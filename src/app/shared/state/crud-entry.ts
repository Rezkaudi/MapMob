import { ActivationStatus } from '../models/activation-status';

/** The least a table row needs for the edit, status and delete dialogs. */
export interface CrudEntry {
  readonly id: string;
  readonly name: string;
  readonly status: ActivationStatus;
}
