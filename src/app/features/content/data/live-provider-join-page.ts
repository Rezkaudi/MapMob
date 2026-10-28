import { LiveContentPage } from './live-content-page';

/**
 * The "join us as a provider" page. The server may not know `registrationFormUrl` yet, so the link
 * is also sent as `body`, the field it keeps for text pages; either one may come back.
 */
export interface LiveProviderJoinPage extends LiveContentPage {
  readonly registrationFormUrl?: string | null;
  readonly body?: string | null;
}
