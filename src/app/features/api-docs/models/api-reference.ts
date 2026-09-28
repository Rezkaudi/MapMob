import { ApiFeature } from './api-feature';
import { DbDomain } from './db-domain';
import { DocsSection, DocsTable } from './docs-section';

/** Everything the page and the exports are built from. */
export interface ApiReference {
  readonly title: string;
  /** A calendar day written `yyyy-mm-dd`. */
  readonly updatedOn: string;
  readonly conventions: readonly DocsSection[];
  readonly features: readonly ApiFeature[];
  readonly domains: readonly DbDomain[];
  /** Table names per column of the complete ERD. */
  readonly wholeErdLayout: DbDomain['layout'];
  readonly buildOrder: DocsTable;
  readonly openQuestions: readonly string[];
}
