import { PlatformSettings } from '../models/platform-settings';

/** `/admin/settings/platform`: the panel's groups, but the logo comes as a full address. */
export interface LivePlatformSettings extends Omit<PlatformSettings, 'general'> {
  readonly general: {
    readonly appName: string;
    readonly logoUrl: string | null;
    readonly supportEmail: string;
    readonly supportPhone: string;
  };
}
