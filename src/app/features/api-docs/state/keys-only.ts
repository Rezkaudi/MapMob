import { DbDomain } from '../models/db-domain';

/** The same diagram with only primary, foreign and unique key columns, for an overview. */
export function keysOnly(domain: DbDomain): DbDomain {
  return {
    ...domain,
    tables: domain.tables.map((table) => ({
      ...table,
      columns: table.columns.filter((column) => column.key || column.references),
    })),
  };
}
