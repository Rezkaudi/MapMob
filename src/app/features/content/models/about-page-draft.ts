import { AboutPage } from './about-page';
import { ContentPageStatus } from './content-page-status';

export interface AboutPageDraft extends Omit<AboutPage, 'bannerUrl'> {
  /** A newly picked banner; `null` keeps the saved one unless `isBannerRemoved`. */
  readonly banner: File | null;
  readonly isBannerRemoved: boolean;
  readonly status: ContentPageStatus;
}
