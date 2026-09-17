import { PlatformGeneralSettings } from './platform-general-settings';

export interface PlatformGeneralDraft extends Omit<PlatformGeneralSettings, 'logoFileName'> {
  /** A newly picked logo, or null to keep the current one. */
  readonly logo: File | null;
}
