import { TestBed } from '@angular/core/testing';
import { PlatformLogoField } from './platform-logo-field';

const LOGO = new File(['x'], 'talabat.png', { type: 'image/png' });
const DOCUMENT = new File(['x'], 'notes.pdf', { type: 'application/pdf' });

function render(savedUrl: string | null = null) {
  URL.createObjectURL = () => 'blob:logo';
  const fixture = TestBed.createComponent(PlatformLogoField);
  fixture.componentRef.setInput('savedUrl', savedUrl);
  fixture.detectChanges();
  return fixture;
}

function pick(fixture: ReturnType<typeof render>, file: File): void {
  const input = (fixture.nativeElement as HTMLElement).querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new Event('change'));
  fixture.detectChanges();
}

describe('PlatformLogoField', () => {
  it('offers the dashed drop zone from the frame while there is no logo', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('app-file-dropzone')).not.toBeNull();
    expect(element.textContent).toContain('اسحب وأفلت الصور هنا');
    expect(element.textContent).toContain('الحد الأقصى لحجم الصورة 5 ميجابايت (JPG, PNG)');
  });

  it('shows a picked logo and reports the file', () => {
    const fixture = render();
    const picked: File[] = [];
    fixture.componentInstance.picked.subscribe((file) => picked.push(file));

    pick(fixture, LOGO);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('img')?.getAttribute('src')).toBe('blob:logo');
    expect(element.textContent).toContain('talabat.png');
    expect(picked).toEqual([LOGO]);
  });

  it('refuses a file that is not a picture', () => {
    const fixture = render();
    const picked: File[] = [];
    fixture.componentInstance.picked.subscribe((file) => picked.push(file));

    pick(fixture, DOCUMENT);

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]')?.textContent,
    ).toContain('يُسمح بصيغ JPG و PNG فقط');
    expect(picked).toEqual([]);
  });

  it('shows the saved logo and reports its removal', () => {
    const fixture = render('https://cdn.test/talabat.png');
    let removedCount = 0;
    fixture.componentInstance.removed.subscribe(() => removedCount++);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('img')?.getAttribute('src')).toBe('https://cdn.test/talabat.png');
    (element.querySelector('[data-testid="remove-platform-logo"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(removedCount).toBe(1);
    expect(element.querySelector('app-file-dropzone')).not.toBeNull();
  });
});
