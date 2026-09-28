import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchInput } from '../../shared/ui/search-input/search-input';
import { UserMenu } from '../user-menu/user-menu';
import { UserMenuItem } from '../user-menu/user-menu-item';
import { USER_MENU_ITEMS } from '../user-menu/user-menu-items';
import { ADMIN_LOGIN_URL } from '../../features/auth/models/login-role';

const DOTTED_BELL_ICON = 'assets/icons/notification.svg';
const PLAIN_BELL_ICON = 'assets/icons/bell.svg';
const INBOX_LABEL = 'الإشعارات الواردة';
const ADMIN_INBOX_ROUTE = '/admin/inbox';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink, SearchInput, UserMenu],
  templateUrl: './top-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBar {
  readonly userName = input.required<string>();
  /** Drawn under the name; the merchant frame has none. */
  readonly userRole = input<string>('');
  readonly avatarUrl = input<string | null>(null);
  readonly unreadNotificationCount = input<number>(0);
  readonly inboxRoute = input<string>(ADMIN_INBOX_ROUTE);
  readonly loginRoute = input<string>(ADMIN_LOGIN_URL);
  readonly userMenuItems = input<readonly UserMenuItem[]>(USER_MENU_ITEMS);

  protected readonly bellIcon = computed(() =>
    this.unreadNotificationCount() > 0 ? DOTTED_BELL_ICON : PLAIN_BELL_ICON,
  );
  protected readonly bellLabel = computed(() => {
    const unread = this.unreadNotificationCount();
    return unread > 0 ? `${INBOX_LABEL} (${unread} غير مقروءة)` : INBOX_LABEL;
  });
}
