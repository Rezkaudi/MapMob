import { DbDomain } from '../models/db-domain';

export const WHOLE_DATABASE_ID = 'db-whole';

/** Every table of every group as one diagram, so links between groups show too. */
export function wholeDatabase(domains: readonly DbDomain[], layout: DbDomain['layout']): DbDomain {
  return {
    id: WHOLE_DATABASE_ID,
    name: 'Complete ERD',
    description: 'All tables and every relationship between them.',
    tables: domains.flatMap((domain) => domain.tables),
    layout,
  };
}
