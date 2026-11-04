export interface LiveOwnerSocialLink {
  readonly id: string;
  /** facebook, instagram, telegram… */
  readonly platform: string;
  /** post, story or page. */
  readonly type?: string;
  readonly url: string;
  readonly sortOrder: number;
}
