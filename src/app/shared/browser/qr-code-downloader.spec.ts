import { TestBed } from '@angular/core/testing';
import { FileSaver } from '../files/file-saver';
import { QrCodeDownloader } from './qr-code-downloader';

describe('QrCodeDownloader', () => {
  afterEach(() => vi.restoreAllMocks());

  it('saves the code as a PNG picture under the given name', async () => {
    const fillRect = vi.fn();
    const picture = new Blob(['png'], { type: 'image/png' });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillStyle: '',
      fillRect,
    } as unknown as CanvasRenderingContext2D);
    const toBlob = vi
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation((done) => done(picture));
    const save = vi.fn();
    TestBed.configureTestingModule({ providers: [{ provide: FileSaver, useValue: { save } }] });

    await TestBed.inject(QrCodeDownloader).download([[true]], 'alhayat-pharmacy-qr.png');

    expect(toBlob.mock.calls[0][1]).toBe('image/png');
    expect(fillRect).toHaveBeenCalled();
    expect(save).toHaveBeenCalledWith(picture, 'alhayat-pharmacy-qr.png');
  });

  it('saves nothing when the browser cannot draw', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const save = vi.fn();
    TestBed.configureTestingModule({ providers: [{ provide: FileSaver, useValue: { save } }] });

    await TestBed.inject(QrCodeDownloader).download([[true]], 'x-qr.png');

    expect(save).not.toHaveBeenCalled();
  });
});
