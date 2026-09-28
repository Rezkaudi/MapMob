import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppIcon } from '../../shared/ui/app-icon/app-icon';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { AuthStore } from '../../features/auth/state/auth.store';
import { UserMenuItem } from './user-menu-item';
import { USER_MENU_ITEMS } from './user-menu-items';
import { ADMIN_LOGIN_URL } from '../../features/auth/models/login-role';

@Component({
  selector: 'app-user-menu',
  imports: [AppIcon, Avatar, RouterLink],
  templateUrl: './user-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  readonly userName = input.required<string>();
  readonly userRole = input<string>('');
  readonly avatarUrl = input<string | null>(null);
  readonly items = input<readonly UserMenuItem[]>(USER_MENU_ITEMS);
  readonly loginRoute = input<string>(ADMIN_LOGIN_URL);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  private readonly store = inject(AuthStore);

  protected readonly isOpen = signal(false);

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected signOut(): void {
    this.close();
    this.store.signOut();
    this.router.navigateByUrl(this.loginRoute());
  }

  @HostListener('document:click', ['$event.target'])
  protected closeWhenClickingOutside(target: EventTarget | null): void {
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.close();
  }
}
