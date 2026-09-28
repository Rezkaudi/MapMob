import { TestBed } from '@angular/core/testing';
import { StoreCoverPicker } from './store-cover-picker';

const SAVED_COVER = 'assets/images/store-cover-pharmacy.jpg';

function render(imageUrl: string | null) {
  const fixture = TestBed.createComponent(StoreCoverPicker);
  fixture.componentRef.setInput('imageUrl', imageUrl);
  fixture.detectChanges();
  const picked: File[] = [];
  fixture.componentInstance.picked.subscribe((file) => picked.push(file));
  return { fixture, element: fixture.nativeElement as HTMLElement, picked };
}

function pickFile(element: HTMLElement, file: File): void {
  const input = element.querySelector('input[type="file"]') as HTMLInputElement;
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new Event('change'));
}

describe('StoreCoverPicker', () => {
  beforeEach(() => {
    URL.createObjectURL = () => 'blob:new-cover';
    URL.revokeObjectURL = () => undefined;
  });

  it('shows the saved cover under its label', () => {
    const { element } = render(SAVED_COVER);

    expect(element.textContent).toContain('صورة الغلاف (الرئيسية)');
    expect(element.querySelector('img')?.getAttribute('src')).toBe(SAVED_COVER);
  });

  it('shows the empty grey frame when there is no cover yet', () => {
    const { element } = render(null);

    expect(element.querySelector('img')).toBeNull();
  });

  it('opens the file picker from the change button, for JPG and PNG only', () => {
    const { element } = render(SAVED_COVER);
    const input = element.querySelector('input[type="file"]') as HTMLInputElement;
    const openPicker = vi.spyOn(input, 'click');

    const button = element.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('تغيير صورة الغلاف');
    button.click();

    expect(openPicker).toHaveBeenCalledOnce();
    expect(input.accept).toBe('image/jpeg,image/png');
  });

  it('previews and hands over a picked picture', () => {
    const { fixture, element, picked } = render(SAVED_COVER);
    const file = new File(['x'], 'cover.png', { type: 'image/png' });

    pickFile(element, file);
    fixture.detectChanges();

    expect(picked).toEqual([file]);
    expect(element.querySelector('img')?.getAttribute('src')).toBe('blob:new-cover');
  });

  it('refuses a file that is not a picture and says why', () => {
    const { fixture, element, picked } = render(SAVED_COVER);

    pickFile(element, new File(['x'], 'menu.pdf', { type: 'application/pdf' }));
    fixture.detectChanges();

    expect(picked).toEqual([]);
    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'يُسمح بصيغ JPG و PNG فقط',
    );
    expect(element.querySelector('img')?.getAttribute('src')).toBe(SAVED_COVER);
  });
  it('keeps its hidden file field inside its own box, so it cannot widen a scrolled page', () => {
    const { fixture } = render(SAVED_COVER);

    expect((fixture.nativeElement as HTMLElement).classList).toContain('relative');
  });
});
