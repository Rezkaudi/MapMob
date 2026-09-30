import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClipboardWriter } from '../../browser/clipboard-writer';
import { QrCodeDownloader } from '../../browser/qr-code-downloader';
import { QrCodePrinter } from '../../browser/qr-code-printer';
import { encodeQrCode } from '../../qr-code/encode-qr-code';
import { toQrCodePath } from '../../qr-code/qr-code-path';
import { StoreQrCard } from './store-qr-card';

const STORE_URL = 'https://mapmob.app/store/alhayat-pharmacy';
const CAPTION = 'رمز QR للوصول مباشرة إلى صفحة المتجر على MapMob';

describe('StoreQrCard', () => {
  let fixture: ComponentFixture<StoreQrCard>;
  let card: HTMLElement;
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
    fixture = TestBed.createComponent(StoreQrCard);
    fixture.componentRef.setInput('url', STORE_URL);
    fixture.componentRef.setInput('storeName', 'صيدلية الحياة');
    fixture.detectChanges();
    card = fixture.nativeElement;
  });

  function button(role: string): HTMLButtonElement {
    return card.querySelector(`[data-role="${role}"]`) as HTMLButtonElement;
  }

  it('titles the card and explains what the code is for', () => {
    expect(card.querySelector('h2')?.textContent?.trim()).toBe('رمز المتجر');
    expect(card.querySelector('h2 + p')?.textContent?.trim()).toBe(CAPTION);
  });

  it('draws a real QR code of the store link', () => {
    const matrix = encodeQrCode(STORE_URL);
    const svg = card.querySelector('svg[role="img"]') as SVGSVGElement;

    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${matrix.length} ${matrix.length}`);
    expect(svg.querySelector('path')?.getAttribute('d')).toBe(toQrCodePath(matrix));
    expect(svg.getAttribute('aria-label')).toBe('رمز QR لصفحة صيدلية الحياة');
  });

  it('shows the link without its scheme in a read-only left-to-right field', () => {
    const field = card.querySelector('input') as HTMLInputElement;
    const label = card.querySelector(`label[for="${field.id}"]`);

    expect(label?.textContent?.trim()).toBe('رابط المتجر المباشر');
    expect(field.value).toBe('mapmob.app/store/alhayat-pharmacy');
    expect(field.readOnly).toBe(true);
    expect(field.dir).toBe('ltr');
  });

  it('copies the full link and says so on the button', async () => {
    button('copy').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(write).toHaveBeenCalledWith(STORE_URL);
    expect(button('copy').getAttribute('aria-label')).toBe('تم نسخ الرابط');
  });

  it('downloads the code as a picture named after the store link', () => {
    button('download').click();

    expect(download).toHaveBeenCalledWith(encodeQrCode(STORE_URL), 'alhayat-pharmacy-qr.png');
  });

  it('prints a sheet with the store name, caption, code and link', () => {
    button('print').click();

    expect(print).toHaveBeenCalledWith({
      storeName: 'صيدلية الحياة',
      caption: CAPTION,
      matrix: encodeQrCode(STORE_URL),
      displayUrl: 'mapmob.app/store/alhayat-pharmacy',
    });
  });

  it('puts the download icon to the right of its label, as the frame does in RTL', () => {
    const [first, second] = [...button('download').children];

    expect(first.tagName.toLowerCase()).toBe('app-icon');
    expect(second.textContent?.trim()).toBe('تحميل QR');
  });

  it('keeps the download button above the print button', () => {
    const roles = [...card.querySelectorAll('[data-role="download"], [data-role="print"]')].map(
      (element) => element.getAttribute('data-role'),
    );

    expect(roles).toEqual(['download', 'print']);
    expect(button('print').textContent?.trim()).toBe('طباعة');
  });
});
