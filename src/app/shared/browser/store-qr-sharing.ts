import { Injectable, inject } from '@angular/core';
import { StoreQrCode } from '../qr-code/store-qr-code';
import { ClipboardWriter } from './clipboard-writer';
import { QrCodeDownloader } from './qr-code-downloader';
import { QrCodePrinter } from './qr-code-printer';

export const STORE_QR_CAPTION = 'رمز QR للوصول مباشرة إلى صفحة المتجر على MapMob';

/** The copy, download and print buttons of every store QR card and dialog. */
@Injectable({ providedIn: 'root' })
export class StoreQrSharing {
  private readonly clipboard = inject(ClipboardWriter);
  private readonly downloader = inject(QrCodeDownloader);
  private readonly printer = inject(QrCodePrinter);

  copyLink(code: StoreQrCode): Promise<void> {
    return this.clipboard.write(code.url);
  }

  download(code: StoreQrCode): Promise<void> {
    return this.downloader.download(code.matrix, code.fileName);
  }

  print(code: StoreQrCode): Promise<void> {
    return this.printer.print({
      storeName: code.storeName,
      caption: STORE_QR_CAPTION,
      matrix: code.matrix,
      displayUrl: code.displayUrl,
    });
  }
}
