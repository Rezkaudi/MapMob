import { TestBed } from '@angular/core/testing';
import { FileRules } from '../media-picker/file-rules';
import { ImageUploadField } from './image-upload-field';
import { UploadedImage } from './uploaded-image';

const RULES: FileRules = {
  maxBytes: 5 * 1024 * 1024,
  accepted: ['image/jpeg', 'image/png'],
  typeMessage: 'يُسمح بصيغ JPG و PNG فقط',
  sizeMessage: 'الحد الأقصى لحجم الصورة 5 ميجابايت',
};
const PICKED: UploadedImage = {
  file: null,
  name: 'summer-promo-ad.jpg',
  previewUrl: 'https://cdn.test/summer.jpg',
  sizeInBytes: 1.4 * 1024 * 1024,
  width: 1200,
  height: 630,
};

function render(image: UploadedImage | null) {
  const fixture = TestBed.createComponent(ImageUploadField);
  fixture.componentRef.setInput('rules', RULES);
  fixture.componentRef.setInput('image', image);
  fixture.detectChanges();
  return fixture;
}

function pick(fixture: ReturnType<typeof render>, file: File): void {
  const input = (fixture.nativeElement as HTMLElement).querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new Event('change'));
}

describe('ImageUploadField', () => {
  it('shows only the dashed drop zone before a picture is picked', () => {
    const element = render(null).nativeElement as HTMLElement;

    expect(element.textContent).toContain('اسحب وأفلت الصور هنا أو');
    expect(element.textContent).toContain('الحد الأقصى لحجم الصورة 5 ميجابايت (JPG, PNG)');
    expect(element.querySelector('[data-role="image-card"]')).toBeNull();
  });

  it('describes the picked picture under the zone', () => {
    const card = (render(PICKED).nativeElement as HTMLElement).querySelector(
      '[data-role="image-card"]',
    ) as HTMLElement;

    expect(card.textContent).toContain('summer-promo-ad.jpg');
    expect(card.textContent).toContain('الحجم: 1.4 ميجابايت — الأبعاد: 1200 × 630 بكسل');
    expect(card.querySelector('img')?.getAttribute('src')).toBe('https://cdn.test/summer.jpg');
  });

  it('refuses a file that breaks the rules and says why', () => {
    const fixture = render(null);
    const imageChange = vi.fn();
    fixture.componentInstance.imageChange.subscribe(imageChange);

    pick(fixture, new File(['x'], 'notes.txt', { type: 'text/plain' }));
    fixture.detectChanges();

    expect(imageChange).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('notes.txt: يُسمح بصيغ JPG و PNG فقط');
  });

  it('clears the picture from "حذف"', () => {
    const fixture = render(PICKED);
    const imageChange = vi.fn();
    fixture.componentInstance.imageChange.subscribe(imageChange);
    const remove = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('[data-role="image-card"] button'),
    ).find((button) => button.textContent?.trim() === 'حذف') as HTMLButtonElement;

    remove.click();

    expect(imageChange).toHaveBeenCalledWith(null);
  });

  it('takes a video instead, with video words and a video preview', () => {
    const fixture = TestBed.createComponent(ImageUploadField);
    fixture.componentRef.setInput('rules', { ...RULES, accepted: ['video/*'] });
    fixture.componentRef.setInput('kind', 'video');
    fixture.componentRef.setInput('image', {
      ...PICKED,
      name: 'promo.mp4',
      width: null,
      height: null,
    });
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('اسحب وأفلت الفيديو هنا أو');
    expect(element.querySelector('[data-role="image-card"] video')).toBeTruthy();
    expect(element.querySelector('[data-role="image-card"] img')).toBeNull();
    expect(element.textContent).toContain('تغيير الفيديو');
  });
});
