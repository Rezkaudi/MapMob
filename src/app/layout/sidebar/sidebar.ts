import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppIcon } from '../../shared/ui/app-icon/app-icon';
import { NavItem } from './nav-item';
import { NAV_ITEMS, SECONDARY_NAV_ITEMS } from './nav-items';

const ADMIN_HOME_ROUTE = '/admin/dashboard';

@Component({
  selector: 'app-sidebar',
  imports: [AppIcon, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  /** The admin nav unless a shell passes its own, as the merchant shell does. */
  readonly navItems = input<readonly NavItem[]>(NAV_ITEMS);
  readonly secondaryNavItems = input<readonly NavItem[]>(SECONDARY_NAV_ITEMS);
  readonly homeRoute = input<string>(ADMIN_HOME_ROUTE);

  /** View state only: the arrow shrinks the rail down to its icons. */
  protected readonly isCollapsed = signal(false);

  protected toggleCollapse(): void {
    this.isCollapsed.update((collapsed) => !collapsed);
  }
}
