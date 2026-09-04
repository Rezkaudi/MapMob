import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppIcon } from '../../shared/ui/app-icon/app-icon';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { AuthStore } from '../../features/auth/state/auth.store';
import { USER_MENU_ITEMS } from './user-menu-items';

const LOGIN_ROUTE = '/login';

@Component({
  selector: 'app-user-menu',
  imports: [AppIcon, Avatar],
  templateUrl: './user-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  readonly userName = input.required<string>();
  readonly userRole = input.required<string>();
  readonly avatarUrl = input<string | null>(null);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  private readonly store = inject(AuthStore);

  protected readonly items = USER_MENU_ITEMS;
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
    this.router.navigateByUrl(LOGIN_ROUTE);
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
