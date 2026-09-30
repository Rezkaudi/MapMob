import { TestBed } from '@angular/core/testing';
import { describeStoreQrCode } from '../qr-code/store-qr-code';
import { ClipboardWriter } from './clipboard-writer';
import { QrCodeDownloader } from './qr-code-downloader';
import { QrCodePrinter } from './qr-code-printer';
import { STORE_QR_CAPTION, StoreQrSharing } from './store-qr-sharing';

const CODE = describeStoreQrCode('https://mapmob.app/store/alhayat-pharmacy', 'صيدلية الحياة');

describe('StoreQrSharing', () => {
  const write = vi.fn(() => Promise.resolve());
  const download = vi.fn(() => Promise.resolve());
  const print = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: ClipboardWriter, useValue: { write } },
        { provide: QrCodeDownloader, useValue: { download } },
        { provide: QrCodePrinter, useValue: { print } },
      ],
    });
  });

  it('copies the full link', async () => {
    await TestBed.inject(StoreQrSharing).copyLink(CODE);

    expect(write).toHaveBeenCalledWith('https://mapmob.app/store/alhayat-pharmacy');
  });

  it('downloads the code under the store file name', async () => {
    await TestBed.inject(StoreQrSharing).download(CODE);

    expect(download).toHaveBeenCalledWith(CODE.matrix, 'alhayat-pharmacy-qr.png');
  });

  it('prints the sheet with the name, caption, code and short link', async () => {
    await TestBed.inject(StoreQrSharing).print(CODE);

    expect(print).toHaveBeenCalledWith({
      storeName: 'صيدلية الحياة',
      caption: STORE_QR_CAPTION,
      matrix: CODE.matrix,
      displayUrl: 'mapmob.app/store/alhayat-pharmacy',
    });
  });
});
