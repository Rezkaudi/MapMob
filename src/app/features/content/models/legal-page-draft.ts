import { ContentPageStatus } from './content-page-status';
import { LegalPage } from './legal-page';

export interface LegalPageDraft extends LegalPage {
  readonly status: ContentPageStatus;
}
