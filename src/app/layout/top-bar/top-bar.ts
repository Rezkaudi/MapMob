import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchInput } from '../../shared/ui/search-input/search-input';
import { UserMenu } from '../user-menu/user-menu';

const DOTTED_BELL_ICON = 'assets/icons/notification.svg';
const PLAIN_BELL_ICON = 'assets/icons/bell.svg';
const INBOX_LABEL = 'الإشعارات الواردة';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink, SearchInput, UserMenu],
  templateUrl: './top-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBar {
  readonly userName = input.required<string>();
  readonly userRole = input.required<string>();
  readonly avatarUrl = input<string | null>(null);
  readonly unreadNotificationCount = input<number>(0);

  protected readonly bellIcon = computed(() =>
    this.unreadNotificationCount() > 0 ? DOTTED_BELL_ICON : PLAIN_BELL_ICON,
  );
  protected readonly bellLabel = computed(() => {
    const unread = this.unreadNotificationCount();
    return unread > 0 ? `${INBOX_LABEL} (${unread} غير مقروءة)` : INBOX_LABEL;
  });
}
