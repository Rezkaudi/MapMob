import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '../../features/auth/state/auth.store';
import { MERCHANT_AUTH_ROUTES } from '../../features/merchant-auth/merchant-auth-paths';
import { MerchantNotificationsStore } from '../../features/merchant-notifications/state/merchant-notifications.store';
import { ScrollGutter } from '../admin-shell/scroll-gutter';
import { RouteProgress } from '../route-progress/route-progress';
import { Sidebar } from '../sidebar/sidebar';
import { TopBar } from '../top-bar/top-bar';
import {
  MERCHANT_HOME_ROUTE,
  MERCHANT_NAV_ITEMS,
  MERCHANT_NOTIFICATIONS_ROUTE,
  MERCHANT_SECONDARY_NAV_ITEMS,
  MERCHANT_USER_MENU_ITEMS,
} from './merchant-nav-items';

const FALLBACK_AVATAR_URL = 'assets/admin-avatar.jpg';

/** The store owner's frame: the admin shell's parts, fed with the merchant nav. */
@Component({
  selector: 'app-merchant-shell',
  imports: [RouterOutlet, RouteProgress, ScrollGutter, Sidebar, TopBar],
  templateUrl: './merchant-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantShell {
  private readonly store = inject(AuthStore);
  private readonly notificationsStore = inject(MerchantNotificationsStore);

  /** The bell shows its red dot from here, so the shell warms the feed once. */
  protected readonly unreadNotificationCount = this.notificationsStore.unreadCount;

  protected readonly homeRoute = MERCHANT_HOME_ROUTE;
  protected readonly navItems = MERCHANT_NAV_ITEMS;
  protected readonly secondaryNavItems = MERCHANT_SECONDARY_NAV_ITEMS;
  protected readonly userMenuItems = MERCHANT_USER_MENU_ITEMS;
  protected readonly notificationsRoute = MERCHANT_NOTIFICATIONS_ROUTE;
  protected readonly loginRoute = MERCHANT_AUTH_ROUTES.login;

  protected readonly userName = computed(() => this.store.user()?.name ?? '');
  protected readonly avatarUrl = computed(
    () => this.store.user()?.avatarUrl ?? FALLBACK_AVATAR_URL,
  );

  constructor() {
    this.notificationsStore.loadOnce();
  }
}
