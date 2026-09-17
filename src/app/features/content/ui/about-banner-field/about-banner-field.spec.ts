import { TestBed } from '@angular/core/testing';
import { UploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image';
import { toUploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image-from-url';
import { AboutBannerField } from './about-banner-field';

function render(banner: UploadedImage | null) {
  const fixture = TestBed.createComponent(AboutBannerField);
  fixture.componentRef.setInput('banner', banner);
  fixture.detectChanges();
  const changes: (UploadedImage | null)[] = [];
  fixture.componentInstance.bannerChange.subscribe((next) => changes.push(next));
  return { fixture, element: fixture.nativeElement as HTMLElement, changes };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  );
}

function pickFile(element: HTMLElement, file: File): void {
  const input = element.querySelector('input[type="file"]') as HTMLInputElement;
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new Event('change'));
}

describe('AboutBannerField', () => {
  beforeEach(() => {
    URL.createObjectURL = () => 'blob:banner';
    URL.revokeObjectURL = () => undefined;
  });

  it('heads the section with its name and hint', () => {
    const { element } = render(null);

    expect(element.querySelector('h2')?.textContent?.trim()).toBe(
      'صورة عن التطبيق (البانر التعريفي)',
    );
    expect(element.textContent).toContain(
      'الصورة أو البانر الترويجي الذي يظهر أعلى شاشة «عن التطبيق» في الواجهة الرئيسية للمستخدمين.',
    );
  });

  it('previews the saved banner with replace and delete actions', () => {
    const { element, changes } = render(toUploadedImage('assets/images/about-app-banner.png'));

    expect(element.querySelector('img')?.getAttribute('src')).toBe(
      'assets/images/about-app-banner.png',
    );
    expect(buttonNamed(element, 'استبدال الصورة')).toBeTruthy();

    buttonNamed(element, 'حذف')?.click();
    expect(changes).toEqual([null]);
  });

  it('offers an upload when there is no banner', () => {
    const { element } = render(null);

    expect(element.querySelector('img')).toBeNull();
    expect(buttonNamed(element, 'حذف')).toBeUndefined();
    expect(buttonNamed(element, 'رفع صورة')).toBeTruthy();
    expect(element.textContent).toContain('لم يتم رفع صورة بعد');
  });

  it('sends a picked picture', () => {
    const { element, changes } = render(null);

    pickFile(element, new File(['png'], 'banner.png', { type: 'image/png' }));

    expect(changes).toHaveLength(1);
    expect(changes[0]?.name).toBe('banner.png');
    expect(changes[0]?.previewUrl).toBe('blob:banner');
  });

  it('refuses a file that is not a JPG or PNG, and says why', () => {
    const { fixture, element, changes } = render(null);

    pickFile(element, new File(['gif'], 'banner.gif', { type: 'image/gif' }));
    fixture.detectChanges();

    expect(changes).toEqual([]);
    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'banner.gif: يُسمح بصيغ JPG و PNG فقط',
    );
  });
});
