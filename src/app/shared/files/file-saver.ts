import { DOCUMENT, Injectable, inject } from '@angular/core';

// Safari can cancel the download when the URL is freed in the same moment as the click.
const URL_RELEASE_DELAY_MS = 1000;

/** Hands a file to the user as a download. */
@Injectable({ providedIn: 'root' })
export class FileSaver {
  private readonly document = inject(DOCUMENT);

  save(file: Blob, fileName: string): void {
    const url = URL.createObjectURL(file);
    const link = this.document.createElement('a');
    link.href = url;
    link.download = fileName;
    // Some browsers only follow a link that is in the page.
    this.document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), URL_RELEASE_DELAY_MS);
  }
}
