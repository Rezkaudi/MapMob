import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '../../features/auth/state/auth.store';
import { InboxStore } from '../../features/inbox/state/inbox.store';
import { RouteProgress } from '../route-progress/route-progress';
import { ScrollGutter } from './scroll-gutter';
import { Sidebar } from '../sidebar/sidebar';
import { TopBar } from '../top-bar/top-bar';

const FALLBACK_AVATAR_URL = 'assets/admin-avatar.jpg';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouteProgress, ScrollGutter, Sidebar, TopBar],
  templateUrl: './admin-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShell {
  private readonly store = inject(AuthStore);
  private readonly inboxStore = inject(InboxStore);

  /** The bell shows its red dot from here, so the shell warms the inbox once. */
  protected readonly unreadNotificationCount = this.inboxStore.unreadCount;

  protected readonly userName = computed(() => this.store.user()?.name ?? '');
  protected readonly userRole = computed(() => this.store.user()?.role ?? '');
  protected readonly avatarUrl = computed(
    () => this.store.user()?.avatarUrl ?? FALLBACK_AVATAR_URL,
  );

  constructor() {
    this.inboxStore.loadOnce();
  }
}
