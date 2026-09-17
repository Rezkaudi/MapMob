import { ContactPage } from './contact-page';
import { ContentPageStatus } from './content-page-status';

export interface ContactPageDraft extends ContactPage {
  readonly status: ContentPageStatus;
}
