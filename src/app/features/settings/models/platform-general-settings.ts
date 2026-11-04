export interface PlatformGeneralSettings {
  readonly appName: string;
  readonly logoFileName: string;
  readonly supportEmail: string;
  readonly supportPhone: string;
  /** Where the mobile app sends a merchant to sign in; null when not set. */
  readonly ownerApplicationUrl: string | null;
}
