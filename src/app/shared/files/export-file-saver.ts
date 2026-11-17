import { Injectable, inject } from '@angular/core';
import { toExcelFile } from './excel-file';
import { FileSaver } from './file-saver';

/** Saves an export from the server as an Excel (.xlsx) file, whatever format the server sent. */
@Injectable({ providedIn: 'root' })
export class ExportFileSaver {
  private readonly fileSaver = inject(FileSaver);

  /** `baseName` has no extension, e.g. "places-2026-11-17". */
  async save(file: Blob, baseName: string): Promise<void> {
    let excelFile: Blob;
    try {
      excelFile = await toExcelFile(file);
    } catch (error) {
      // The Excel library could not load (offline, or a new version was deployed meanwhile).
      // Hand over the server's file as it came, so the export is not lost.
      console.error('Could not turn the export into an Excel file', error);
      this.fileSaver.save(file, `${baseName}.csv`);
      return;
    }
    this.fileSaver.save(excelFile, `${baseName}.xlsx`);
  }
}
