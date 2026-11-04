import { AboutPage } from './about-page';

export interface AboutPageDraft extends Omit<AboutPage, 'bannerUrl'> {
  /** A newly picked banner; `null` keeps the saved one unless `isBannerRemoved`. */
  readonly banner: File | null;
  readonly isBannerRemoved: boolean;
}
