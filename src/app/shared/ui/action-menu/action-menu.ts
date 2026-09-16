import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/** Gap between the trigger and the panel, from the design. */
const OFFSET_PX = 4;
/** Tallest the panel gets: the four-item menu of the places table. */
const PANEL_HEIGHT_PX = 163;

export type ActionMenuStyle = 'soft' | 'sharp';

/** The featured package card is dark blue, so its dots are drawn in white instead. */
export type ActionMenuTriggerTone = 'default' | 'inverse';

const INVERSE_TRIGGER_CLASSES = 'text-white/80 hover:bg-white/10';

interface MenuSkin {
  readonly trigger: string;
  readonly panel: string;
}

/** The places tables use the soft style; the regions design draws square corners, a deeper shadow and dark dots. */
const MENU_SKINS: Record<ActionMenuStyle, MenuSkin> = {
  soft: {
    trigger: 'text-text-secondary hover:bg-surface-muted',
    panel: 'rounded-xl p-[5px] shadow-[0_8px_24px_rgba(15,23,42,0.12)]',
  },
  sharp: {
    trigger: 'text-text-primary hover:bg-surface-muted',
    panel: 'rounded-[2px] p-1 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]',
  },
};

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
  readonly menuStyle = input<ActionMenuStyle>('soft');
  readonly triggerTone = input<ActionMenuTriggerTone>('default');

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');

  protected readonly isOpen = signal(false);
  protected readonly position = signal<PanelPosition>({ left: 0, top: 0 });
  protected readonly skin = computed(() => MENU_SKINS[this.menuStyle()]);
  protected readonly triggerClasses = computed(() =>
    this.triggerTone() === 'inverse' ? INVERSE_TRIGGER_CLASSES : this.skin().trigger,
  );

  protected toggle(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      return;
    }
    this.position.set(this.measure());
    this.isOpen.set(true);
  }

  /** Every item either navigates or opens a dialog, so picking one is done with the menu. */
  protected closeAfterPick(): void {
    this.isOpen.set(false);
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
