import { TestBed } from '@angular/core/testing';
import { toQrCodePath } from '../qr-code/qr-code-path';
import { QrCodePrintPage } from '../qr-code/qr-code-print-page';
import { QrCodePrinter } from './qr-code-printer';

const PAGE: QrCodePrintPage = {
  storeName: 'صيدلية الحياة',
  caption: 'رمز QR للوصول مباشرة إلى صفحة المتجر على MapMob',
  displayUrl: 'mapmob.app/store/alhayat-pharmacy',
  matrix: [
    [true, false],
    [false, true],
  ],
};

function catchPrintFrame() {
  const print = vi.fn();
  const frames: HTMLIFrameElement[] = [];
  const appendChild = document.body.appendChild.bind(document.body);
  vi.spyOn(document.body, 'appendChild').mockImplementation(<T extends Node>(node: T): T => {
    appendChild(node);
    if (node instanceof HTMLIFrameElement) {
      frames.push(node);
      vi.spyOn(node.contentWindow!, 'print').mockImplementation(print);
    }
    return node;
  });
  return { print, frames };
}

describe('QrCodePrinter', () => {
  afterEach(() => vi.restoreAllMocks());

  it('prints a page with the store name, the caption, the code and the link', async () => {
    const { print, frames } = catchPrintFrame();

    await TestBed.inject(QrCodePrinter).print(PAGE);

    const page = frames[0].contentDocument!;
    expect(page.documentElement.dir).toBe('rtl');
    expect(page.querySelector('h1')?.textContent).toBe('صيدلية الحياة');
    expect(page.querySelector('[data-role="caption"]')?.textContent).toBe(PAGE.caption);
    expect(page.querySelector('path')?.getAttribute('d')).toBe(toQrCodePath(PAGE.matrix));
    expect(page.querySelector('[data-role="link"]')?.textContent).toBe(PAGE.displayUrl);
    expect(print).toHaveBeenCalledTimes(1);
  });

  it('keeps a store name that looks like markup as plain text', async () => {
    const { frames } = catchPrintFrame();

    await TestBed.inject(QrCodePrinter).print({ ...PAGE, storeName: '<img src=x>' });

    const page = frames[0].contentDocument!;
    expect(page.querySelector('img')).toBeNull();
    expect(page.querySelector('h1')?.textContent).toBe('<img src=x>');
  });

  it('removes the hidden print frame once printing is over', async () => {
    const { frames } = catchPrintFrame();

    await TestBed.inject(QrCodePrinter).print(PAGE);
    expect(frames[0].isConnected).toBe(true);
    frames[0].contentWindow!.dispatchEvent(new Event('afterprint'));

    expect(frames[0].isConnected).toBe(false);
  });
});
