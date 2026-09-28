import { DbColumn } from './db-column';

export interface DbTable {
  readonly name: string;
  readonly description: string;
  /** The API resource the rows are served as. */
  readonly servedAs: string;
  readonly columns: readonly DbColumn[];
  readonly indexes?: readonly string[];
}
