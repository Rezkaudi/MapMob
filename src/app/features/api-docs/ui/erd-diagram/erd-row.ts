import { DbColumn } from '../../models/db-column';

/** One column line of a diagram card, placed and ready to draw. */
export interface ErdRow {
  readonly column: DbColumn;
  readonly y: number;
  readonly keyLabel: string;
  readonly typeLabel: string;
  readonly isExternalReference: boolean;
}
