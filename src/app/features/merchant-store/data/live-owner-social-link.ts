export interface LiveOwnerSocialLink {
  readonly id: string;
  /** facebook, instagram, telegram… */
  readonly platform: string;
  readonly url: string;
  readonly sortOrder: number;
}
