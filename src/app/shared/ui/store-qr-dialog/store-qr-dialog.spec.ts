import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreQrSharing } from '../../browser/store-qr-sharing';
import { describeStoreQrCode } from '../../qr-code/store-qr-code';
import { StoreQrDialog } from './store-qr-dialog';

const STORE_URL = 'https://mapmob.app/store/abualez';
const CODE = describeStoreQrCode(STORE_URL, 'أبو العز');

describe('StoreQrDialog', () => {
  let fixture: ComponentFixture<StoreQrDialog>;
  let dialog: HTMLElement;
  const sharing = {
    copyLink: vi.fn(() => Promise.resolve()),
    download: vi.fn(() => Promise.resolve()),
    print: vi.fn(() => Promise.resolve()),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({ providers: [{ provide: StoreQrSharing, useValue: sharing }] });
    fixture = TestBed.createComponent(StoreQrDialog);
    fixture.componentRef.setInput('url', STORE_URL);
    fixture.componentRef.setInput('storeName', 'أبو العز');
    fixture.detectChanges();
    dialog = fixture.nativeElement;
  });

  function button(role: string): HTMLButtonElement {
    return dialog.querySelector(`[data-role="${role}"]`) as HTMLButtonElement;
  }

  it('heads the dialog with its title and what the code does', () => {
    expect(dialog.querySelector('h2')?.textContent?.trim()).toBe('رمز QR للمتجر');
    expect(dialog.querySelector('header p')?.textContent?.trim()).toBe(
      'امسح الرمز للوصول مباشرة إلى صفحة المتجر على MapMob',
    );
  });

  it('draws the real code of the store link inside four scan corners', () => {
    const svg = dialog.querySelector('svg[role="img"]') as SVGSVGElement;

    expect(svg.querySelector('path')?.getAttribute('d')).toBe(CODE.path);
    expect(svg.getAttribute('aria-label')).toBe('رمز QR لصفحة أبو العز');
    expect(dialog.querySelectorAll('[data-role="scan-corner"]').length).toBe(4);
  });

  it('shows the full link in a read-only left-to-right field', () => {
    const field = dialog.querySelector('input') as HTMLInputElement;

    expect(dialog.querySelector(`label[for="${field.id}"]`)?.textContent?.trim()).toBe(
      'رابط المتجر المباشر',
    );
    expect(field.value).toBe(STORE_URL);
    expect(field.readOnly).toBe(true);
    expect(field.dir).toBe('ltr');
  });

  it('copies the link, with the icon to the right of "نسخ", then says it is done', async () => {
    const [icon, label] = [...button('copy').children];
    expect(icon.tagName.toLowerCase()).toBe('app-icon');
    expect(label.textContent?.trim()).toBe('نسخ');

    button('copy').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(sharing.copyLink).toHaveBeenCalledWith(CODE);
    expect(button('copy').textContent?.trim()).toBe('تم النسخ');
  });

  it('puts download on the right and print on the left of the footer, as equal halves', () => {
    const footerButtons = [...dialog.querySelectorAll('footer button')];

    expect(footerButtons.map((item) => item.getAttribute('data-role'))).toEqual([
      'download',
      'print',
    ]);
    expect(button('download').textContent?.trim()).toBe('تحميل QR (PNG)');
    expect(button('download').firstElementChild?.tagName.toLowerCase()).toBe('app-icon');
    expect(button('print').textContent?.trim()).toBe('طباعة QR');
    expect(footerButtons.every((item) => item.classList.contains('flex-1'))).toBe(true);
  });

  it('downloads and prints the store code', () => {
    button('download').click();
    button('print').click();

    expect(sharing.download).toHaveBeenCalledWith(CODE);
    expect(sharing.print).toHaveBeenCalledWith(CODE);
  });

  it('closes from the cross', () => {
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);

    (dialog.querySelector('button[aria-label="إغلاق النافذة"]') as HTMLButtonElement).click();

    expect(closed).toHaveBeenCalledOnce();
  });
});
