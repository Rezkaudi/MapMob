import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/** Gap between the trigger and the panel, from the design. */
const OFFSET_PX = 4;
/** Tallest the panel gets: the four-item menu of the places table. */
const PANEL_HEIGHT_PX = 163;

interface PanelPosition {
  readonly left: number;
  /** Set when the panel hangs below the trigger. */
  readonly top?: number;
  /** Set instead of `top` when the panel flips above it. */
  readonly bottom?: number;
}

/**
 * The tables clip their corners with `overflow-hidden`, so the panel is positioned
 * `fixed` against the trigger's rect rather than absolutely inside it.
 */
@Component({
  selector: 'app-action-menu',
  imports: [AppIcon],
  templateUrl: './action-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenu {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');

  protected readonly isOpen = signal(false);
  protected readonly position = signal<PanelPosition>({ left: 0, top: 0 });

  protected toggle(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      return;
    }
    this.position.set(this.measure());
    this.isOpen.set(true);
  }

  private measure(): PanelPosition {
    const rect = this.trigger().nativeElement.getBoundingClientRect();
    const roomBelow = window.innerHeight - rect.bottom;
    if (roomBelow < PANEL_HEIGHT_PX) {
      return { left: rect.left, bottom: window.innerHeight - rect.top + OFFSET_PX };
    }
    return { left: rect.left, top: rect.bottom + OFFSET_PX };
  }

  @HostListener('document:click', ['$event.target'])
  protected closeWhenClickingOutside(target: EventTarget | null): void {
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }

  /**
   * A fixed panel does not travel with its row, so scrolling closes it instead of
   * leaving it stranded. Capture catches scrolling inside `main`, which does not bubble.
   */
  @HostListener('document:scroll')
  @HostListener('window:resize')
  protected closeWhenTheRowMoves(): void {
    this.isOpen.set(false);
  }
}
