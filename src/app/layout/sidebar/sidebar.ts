import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppIcon } from '../../shared/ui/app-icon/app-icon';
import { NAV_ITEMS, SECONDARY_NAV_ITEMS } from './nav-items';

@Component({
  selector: 'app-sidebar',
  imports: [AppIcon, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  protected readonly navItems = NAV_ITEMS;
  protected readonly secondaryNavItems = SECONDARY_NAV_ITEMS;
}
