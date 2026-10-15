import { LiveContentPage } from './live-content-page';

/** The terms or the privacy policy. A page never saved has no body. */
export interface LiveLegalPage extends LiveContentPage {
  readonly body: string | null;
}
