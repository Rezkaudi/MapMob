import { ContentPageKind } from './content-page-kind';
import { ContentPageStatus } from './content-page-status';

/** One row of the content pages table. */
export interface ContentPage {
  readonly kind: ContentPageKind;
  readonly title: string;
  /** A calendar day written `yyyy-mm-dd`. */
  readonly updatedOn: string;
  readonly status: ContentPageStatus;
}
