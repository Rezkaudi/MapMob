import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { SettingsNav } from '../../ui/settings-nav/settings-nav';

@Component({
  selector: 'app-settings-layout',
  imports: [PageHeader, RouterOutlet, SettingsNav],
  templateUrl: './settings-layout.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsLayout {}
