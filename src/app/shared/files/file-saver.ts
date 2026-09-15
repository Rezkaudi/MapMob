import { DOCUMENT, Injectable, inject } from '@angular/core';

/** Hands a file made in the browser to the user as a download. */
@Injectable({ providedIn: 'root' })
export class FileSaver {
  private readonly document = inject(DOCUMENT);

  save(file: Blob, fileName: string): void {
    const url = URL.createObjectURL(file);
    const link = this.document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }
}
