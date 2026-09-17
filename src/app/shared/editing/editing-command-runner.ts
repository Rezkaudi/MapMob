import { DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * The browser's built-in editing commands. They are deprecated but still the only native way to
 * edit a `contenteditable` area without a library; wrapping them keeps the editor testable.
 */
@Injectable({ providedIn: 'root' })
export class EditingCommandRunner {
  private readonly document = inject(DOCUMENT);

  run(name: string, value?: string): void {
    this.document.execCommand(name, false, value);
  }

  isActive(name: string): boolean {
    return this.document.queryCommandState(name);
  }

  valueOf(name: string): string {
    return this.document.queryCommandValue(name);
  }
}
