import { DOCUMENT, Injectable, inject } from '@angular/core';
import { FileSaver } from '../files/file-saver';
import { drawQrCode, measureQrCodeImage } from '../qr-code/draw-qr-code';
import { QrCodeMatrix } from '../qr-code/qr-code-matrix';

/** 24px modules give a picture of about 900px, sharp enough for a printed sticker. */
const MODULE_SIZE_PX = 24;
const PNG_TYPE = 'image/png';

@Injectable({ providedIn: 'root' })
export class QrCodeDownloader {
  private readonly document = inject(DOCUMENT);
  private readonly fileSaver = inject(FileSaver);

  async download(matrix: QrCodeMatrix, fileName: string): Promise<void> {
    const canvas = this.document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    canvas.width = canvas.height = measureQrCodeImage(matrix, MODULE_SIZE_PX);
    drawQrCode(context, matrix, MODULE_SIZE_PX);
    const picture = await new Promise<Blob | null>((done) => canvas.toBlob(done, PNG_TYPE));
    if (picture) {
      this.fileSaver.save(picture, fileName);
    }
  }
}
