import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import { PlatformSettingsStore } from '../../state/platform-settings.store';
import { CurrencySettingsCard } from '../../ui/currency-settings-card/currency-settings-card';
import { LanguageSettingsCard } from '../../ui/language-settings-card/language-settings-card';
import { MapSettingsCard } from '../../ui/map-settings-card/map-settings-card';
import { PlatformGeneralCard } from '../../ui/platform-general-card/platform-general-card';
import { SettingsSectionHeading } from '../../ui/settings-section-heading/settings-section-heading';
import {
  PLATFORM_FAILED_TITLE,
  PLATFORM_SAVED_MESSAGES,
  PLATFORM_SAVED_TITLE,
} from './platform-settings-copy';

const CARD_PLACEHOLDER_COUNT = 4;

@Component({
  selector: 'app-platform-settings',
  imports: [
    CurrencySettingsCard,
    ErrorState,
    LanguageSettingsCard,
    MapSettingsCard,
    PlatformGeneralCard,
    SettingsSectionHeading,
    Skeleton,
    Toast,
  ],
  templateUrl: './platform-settings.html',
  providers: [PlatformSettingsStore],
  host: { class: 'flex flex-col gap-6' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformSettingsPage {
  protected readonly store = inject(PlatformSettingsStore);
  protected readonly savedTitle = PLATFORM_SAVED_TITLE;
  protected readonly failedTitle = PLATFORM_FAILED_TITLE;
  protected readonly placeholderCards = Array.from({ length: CARD_PLACEHOLDER_COUNT });
  protected readonly savedMessage = computed(() => {
    const form = this.store.savedForm();
    return form ? PLATFORM_SAVED_MESSAGES[form] : null;
  });

  constructor() {
    this.store.loadSettings();
  }
}
