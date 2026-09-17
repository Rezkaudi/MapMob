/** What the "عن التطبيق" screen shows. */
export interface AboutPage {
  readonly title: string;
  readonly bannerUrl: string | null;
  /** Rich text, as HTML. */
  readonly summary: string;
  readonly phone: string;
  readonly email: string;
  readonly address: string;
}
