import { Injectable, computed, signal } from '@angular/core';

/** Counts what the user must wait for: running saves and spinners on screen. While any runs, the page is locked. */
@Injectable({ providedIn: 'root' })
export class PageLock {
  private readonly holdCount = signal(0);

  readonly isBusy = computed(() => this.holdCount() > 0);

  start(): void {
    this.holdCount.update((count) => count + 1);
  }

  finish(): void {
    this.holdCount.update((count) => Math.max(0, count - 1));
  }
}
