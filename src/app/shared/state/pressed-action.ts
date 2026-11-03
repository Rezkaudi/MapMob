import { Signal, computed, signal } from '@angular/core';

/** Remembers which button in a group was pressed, so only that one spins while the group waits. */
export class PressedAction<TAction extends string> {
  private readonly pressed = signal<TAction | null>(null);

  readonly spinning = computed(() => (this.isBusy() ? this.pressed() : null));

  constructor(private readonly isBusy: Signal<boolean>) {}

  press(action: TAction): void {
    this.pressed.set(action);
  }
}
