import { Injectable, inject } from '@angular/core';
import { FileSaver } from '../../../shared/files/file-saver';
import { API_REFERENCE } from '../data/api-reference';
import { buildApiReferenceMarkdown } from './api-reference-markdown';
import { BrowserPrinter } from './browser-printer';

export const README_FILE_NAME = 'MapMob-API-Reference.md';
const MARKDOWN_TYPE = 'text/markdown;charset=utf-8';

@Injectable({ providedIn: 'root' })
export class ApiReferenceExporter {
  private readonly reference = inject(API_REFERENCE);
  private readonly fileSaver = inject(FileSaver);
  private readonly printer = inject(BrowserPrinter);

  downloadReadme(): void {
    const markdown = buildApiReferenceMarkdown(this.reference);
    this.fileSaver.save(new Blob([markdown], { type: MARKDOWN_TYPE }), README_FILE_NAME);
  }

  printPdf(): void {
    this.printer.print();
  }
}
