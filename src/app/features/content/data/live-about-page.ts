import { LiveContentPage } from './live-content-page';

export interface LiveAboutPage extends LiveContentPage {
  readonly bannerUrl: string | null;
  readonly summary: string | null;
  readonly phone: string | null;
  readonly email: string | null;
  readonly address: string | null;
}
