import { DestroyRef, inject, signal } from '@angular/core';

const VISIBLE_MS = 2000;

/** The short "copied" state of a copy button. Create it in an injection context. */
export class CopiedNotice {
  private readonly visible = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  readonly isVisible = this.visible.asReadonly();

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  show(): void {
    this.visible.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.visible.set(false), VISIBLE_MS);
  }
}
