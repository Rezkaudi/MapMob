import { DOCUMENT, Injectable, inject } from '@angular/core';

/** Opens the browser's print dialog, where "Save as PDF" is one of the printers. */
@Injectable({ providedIn: 'root' })
export class BrowserPrinter {
  private readonly document = inject(DOCUMENT);

  print(): void {
    this.document.defaultView?.print();
  }
}
