import { TestBed } from '@angular/core/testing';
import { FileDropzone } from './file-dropzone';

describe('FileDropzone', () => {
  it('shows the prompt and the hint', () => {
    const fixture = TestBed.createComponent(FileDropzone);
    fixture.componentRef.setInput('prompt', 'اسحب وأفلت الصور هنا');
    fixture.componentRef.setInput('hint', 'الحد الأقصى لحجم الصورة 5 ميجابايت (JPG, PNG)');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('اسحب وأفلت الصور هنا');
    expect(text).toContain('استعرض الملفات');
    expect(text).toContain('5 ميجابايت');
  });

  it('highlights itself while a file is dragged over, and clears it on drop', () => {
    const fixture = TestBed.createComponent(FileDropzone);
    fixture.componentRef.setInput('prompt', 'اسحب وأفلت الصور هنا');
    fixture.detectChanges();

    const zone: HTMLElement = fixture.nativeElement.querySelector('label');
    zone.dispatchEvent(new Event('dragenter'));
    fixture.detectChanges();
    expect(zone.className).toContain('border-primary');

    const drop = new Event('drop') as DragEvent;
    Object.defineProperty(drop, 'dataTransfer', { value: { files: [] } });
    zone.dispatchEvent(drop);
    fixture.detectChanges();
    expect(zone.className).not.toContain('border-primary');
  });

  it('anchors the hidden input to the zone', () => {
    const fixture = TestBed.createComponent(FileDropzone);
    fixture.componentRef.setInput('prompt', 'اسحب وأفلت الصور هنا');
    fixture.detectChanges();

    // The input is absolutely positioned. Without a positioned label its containing
    // block becomes the document, so it escapes the page's scroll container and
    // focusing it (which the browser does when the file dialog closes) scrolls the
    // whole document away from the app.
    expect(fixture.nativeElement.querySelector('label').className).toContain('relative');
  });

  it('emits the files that were dropped on it', () => {
    const fixture = TestBed.createComponent(FileDropzone);
    fixture.componentRef.setInput('prompt', 'اسحب وأفلت الصور هنا');
    let picked: readonly File[] = [];
    fixture.componentInstance.filesPicked.subscribe((files) => (picked = files));
    fixture.detectChanges();

    const file = new File(['x'], 'shop.png', { type: 'image/png' });
    const event = new Event('drop') as DragEvent;
    Object.defineProperty(event, 'dataTransfer', { value: { files: [file] } });
    fixture.nativeElement.querySelector('label').dispatchEvent(event);

    expect(picked.map((f) => f.name)).toEqual(['shop.png']);
  });
});
