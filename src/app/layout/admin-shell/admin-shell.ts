import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '../../features/auth/state/auth.store';
import { RouteProgress } from '../route-progress/route-progress';
import { Sidebar } from '../sidebar/sidebar';
import { TopBar } from '../top-bar/top-bar';

const FALLBACK_AVATAR_URL = 'assets/admin-avatar.jpg';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouteProgress, Sidebar, TopBar],
  templateUrl: './admin-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShell {
  private readonly store = inject(AuthStore);

  protected readonly userName = computed(() => this.store.user()?.name ?? '');
  protected readonly userRole = computed(() => this.store.user()?.role ?? '');
  protected readonly avatarUrl = computed(
    () => this.store.user()?.avatarUrl ?? FALLBACK_AVATAR_URL,
  );
}
