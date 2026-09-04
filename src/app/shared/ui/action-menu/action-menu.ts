import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

@Component({
  selector: 'app-action-menu',
  imports: [AppIcon],
  templateUrl: './action-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenu {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly isOpen = signal(false);

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  @HostListener('document:click', ['$event.target'])
  protected closeWhenClickingOutside(target: EventTarget | null): void {
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }
}
