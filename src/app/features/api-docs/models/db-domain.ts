import { DbTable } from './db-table';

export interface DbDomain {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly tables: readonly DbTable[];
  /** Table names per diagram column, left to right, each column top to bottom. */
  readonly layout: readonly (readonly string[])[];
}
