import { ContentPageStatus } from './content-page-status';
import { ProviderJoinPage } from './provider-join-page';

export interface ProviderJoinPageDraft extends ProviderJoinPage {
  readonly status: ContentPageStatus;
}
