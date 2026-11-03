import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PageLock } from '../../core/page-lock/page-lock';

/** Blocks every click and key press while the page is locked, so nothing happens before a spinner ends. */
@Component({
  selector: 'app-page-lock-overlay',
  templateUrl: './page-lock-overlay.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLockOverlay {
  protected readonly isBusy = inject(PageLock).isBusy;

  constructor() {
    const document = inject(DOCUMENT);
    const swallowKeyWhileBusy = (event: KeyboardEvent): void => {
      if (!this.isBusy()) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    };
    // Capture phase, so the key never reaches a button, a form or a dialog's Escape handler.
    document.addEventListener('keydown', swallowKeyWhileBusy, true);
    inject(DestroyRef).onDestroy(() =>
      document.removeEventListener('keydown', swallowKeyWhileBusy, true),
    );
  }
}
