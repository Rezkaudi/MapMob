import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { SETTINGS_SECTIONS, SETTINGS_URL } from '../../state/settings-sections';

/** The white 243px card of settings tabs on the right of every settings page. */
@Component({
  selector: 'app-settings-nav',
  imports: [AppIcon, RouterLink, RouterLinkActive],
  templateUrl: './settings-nav.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsNav {
  protected readonly sections = SETTINGS_SECTIONS;
  protected readonly settingsUrl = SETTINGS_URL;
}
