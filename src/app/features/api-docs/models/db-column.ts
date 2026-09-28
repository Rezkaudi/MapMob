export type DbColumnKey = 'pk' | 'fk' | 'uq';

export interface DbColumn {
  readonly name: string;
  readonly type: string;
  readonly key?: DbColumnKey;
  /** `table.column` of the row this points at. */
  readonly references?: string;
  readonly isNullable?: boolean;
  readonly note?: string;
}
