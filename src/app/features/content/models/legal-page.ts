/** The terms and the privacy policy: a title and one rich text. */
export interface LegalPage {
  readonly title: string;
  /** Rich text, as HTML. */
  readonly body: string;
}
