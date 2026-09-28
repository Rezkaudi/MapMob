import { DOCUMENT, Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClipboardWriter {
  private readonly document = inject(DOCUMENT);

  write(text: string): Promise<void> {
    return this.document.defaultView?.navigator.clipboard.writeText(text) ?? Promise.resolve();
  }
}
