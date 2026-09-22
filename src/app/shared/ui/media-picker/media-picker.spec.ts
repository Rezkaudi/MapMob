import { TestBed } from '@angular/core/testing';
import { MediaFile } from './media-file';
import { MediaPicker } from './media-picker';

const IMAGE_RULES = {
  maxBytes: 5 * 1024 * 1024,
  accepted: ['image/jpeg', 'image/png'],
  typeMessage: 'يُسمح بصيغ JPG و PNG فقط',
  sizeMessage: 'الحد الأقصى لحجم الصورة 5 ميجابايت',
};

function createFile(name: string, type: string, sizeInBytes = 10): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeInBytes });
  return file;
}

function render(files: MediaFile[] = [], limit?: number) {
  const fixture = TestBed.createComponent(MediaPicker);
  fixture.componentRef.setInput('prompt', 'اسحب وأفلت الصور هنا');
  fixture.componentRef.setInput('rules', IMAGE_RULES);
  fixture.componentRef.setInput('files', files);
  if (limit !== undefined) {
    fixture.componentRef.setInput('limit', limit);
    fixture.componentRef.setInput('noun', 'صور');
  }
  const emitted: MediaFile[][] = [];
  fixture.componentInstance.filesChange.subscribe((next) => emitted.push([...next]));
  fixture.detectChanges();
  return { fixture, emitted };
}

function drop(fixture: ReturnType<typeof render>['fixture'], files: File[]) {
  const event = new Event('drop') as DragEvent;
  Object.defineProperty(event, 'dataTransfer', { value: { files } });
  fixture.nativeElement.querySelector('label').dispatchEvent(event);
  fixture.detectChanges();
}

describe('MediaPicker', () => {
  beforeEach(() => {
    let next = 0;
    URL.createObjectURL = () => `blob:preview-${++next}`;
    URL.revokeObjectURL = () => undefined;
  });

  it('adds a dropped file with a preview url, keeping the File for a later upload', () => {
    const { fixture, emitted } = render();
    const picked = createFile('shop.png', 'image/png');

    drop(fixture, [picked]);

    expect(emitted[0].length).toBe(1);
    expect(emitted[0][0].name).toBe('shop.png');
    expect(emitted[0][0].previewUrl).toContain('blob:');
    expect(emitted[0][0].file).toBe(picked);
  });

  it('takes only as many files as the package still allows, and says why', () => {
    const existing: MediaFile[] = [
      {
        id: 'a',
        name: 'a.png',
        sizeInBytes: 10,
        file: createFile('a.png', 'image/png'),
        previewUrl: 'blob:a',
      },
      {
        id: 'b',
        name: 'b.png',
        sizeInBytes: 10,
        file: createFile('b.png', 'image/png'),
        previewUrl: 'blob:b',
      },
    ];
    const { fixture, emitted } = render(existing, 3);

    drop(fixture, [createFile('c.png', 'image/png'), createFile('d.png', 'image/png')]);

    expect(emitted[0].map((item) => item.name)).toEqual(['a.png', 'b.png', 'c.png']);
    expect(fixture.nativeElement.textContent).toContain('لا تسمح الباقة الحالية بأكثر من 3 صور');
  });

  it('adds nothing once the package quota is already full', () => {
    const existing: MediaFile[] = [
      {
        id: 'a',
        name: 'a.png',
        sizeInBytes: 10,
        file: createFile('a.png', 'image/png'),
        previewUrl: 'blob:a',
      },
    ];
    const { fixture, emitted } = render(existing, 1);

    drop(fixture, [createFile('b.png', 'image/png')]);

    expect(emitted).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('لا تسمح الباقة الحالية بأكثر من 1 صور');
  });

  it('counts a file that the rules reject against nothing', () => {
    const { fixture, emitted } = render([], 1);

    drop(fixture, [createFile('bad.pdf', 'application/pdf'), createFile('ok.png', 'image/png')]);

    expect(emitted[0].map((item) => item.name)).toEqual(['ok.png']);
  });

  it('keeps taking files when no limit is given', () => {
    const { fixture, emitted } = render();

    drop(fixture, [createFile('a.png', 'image/png'), createFile('b.png', 'image/png')]);

    expect(emitted[0]).toHaveLength(2);
  });

  it('rejects a file of the wrong type and shows why, without adding it', () => {
    const { fixture, emitted } = render();

    drop(fixture, [createFile('notes.pdf', 'application/pdf')]);

    expect(emitted.length).toBe(0);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('notes.pdf');
    expect(text).toContain('يُسمح بصيغ JPG و PNG فقط');
  });

  it('rejects a file over the size limit', () => {
    const { fixture, emitted } = render();

    drop(fixture, [createFile('huge.png', 'image/png', 6 * 1024 * 1024)]);

    expect(emitted.length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('الحد الأقصى لحجم الصورة 5 ميجابايت');
  });

  it('keeps the good files when one of a batch is rejected', () => {
    const { fixture, emitted } = render();

    drop(fixture, [createFile('ok.png', 'image/png'), createFile('bad.pdf', 'application/pdf')]);

    expect(emitted[0].map((item) => item.name)).toEqual(['ok.png']);
    expect(fixture.nativeElement.textContent).toContain('bad.pdf');
  });

  it('renders a preview image per file and marks the first as the main one', () => {
    const { fixture } = render([
      {
        id: 'a',
        name: 'a.png',
        sizeInBytes: 10,
        file: createFile('a.png', 'image/png'),
        previewUrl: 'blob:a',
      },
      {
        id: 'b',
        name: 'b.png',
        sizeInBytes: 10,
        file: createFile('b.png', 'image/png'),
        previewUrl: 'blob:b',
      },
    ]);

    const images: HTMLImageElement[] = Array.from(fixture.nativeElement.querySelectorAll('li img'));
    expect(images.map((image) => image.getAttribute('src'))).toEqual(['blob:a', 'blob:b']);
    expect(fixture.nativeElement.textContent).toContain('الصورة الرئيسية');
  });

  it('drops the quota message once a file is removed and a slot is free again', () => {
    const existing: MediaFile[] = [
      {
        id: 'a',
        name: 'a.png',
        sizeInBytes: 10,
        file: createFile('a.png', 'image/png'),
        previewUrl: 'blob:a',
      },
    ];
    const { fixture } = render(existing, 1);

    drop(fixture, [createFile('b.png', 'image/png')]);
    expect(fixture.nativeElement.textContent).toContain('لا تسمح الباقة الحالية بأكثر من 1 صور');

    fixture.nativeElement.querySelector('button[aria-label="إزالة a.png"]').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('لا تسمح الباقة الحالية');
  });

  it('removes a file when its remove button is pressed', () => {
    const { fixture, emitted } = render([
      {
        id: 'a',
        name: 'a.png',
        sizeInBytes: 10,
        file: createFile('a.png', 'image/png'),
        previewUrl: 'blob:a',
      },
      {
        id: 'b',
        name: 'b.png',
        sizeInBytes: 10,
        file: createFile('b.png', 'image/png'),
        previewUrl: 'blob:b',
      },
    ]);

    fixture.nativeElement.querySelector('button[aria-label="إزالة a.png"]').click();

    expect(emitted[0].map((item) => item.id)).toEqual(['b']);
  });

  it('labels the promote button with the words the design puts on it', () => {
    const { fixture } = render([
      {
        id: 'a',
        name: 'a.png',
        sizeInBytes: 10,
        file: createFile('a.png', 'image/png'),
        previewUrl: 'blob:a',
      },
      {
        id: 'b',
        name: 'b.png',
        sizeInBytes: 10,
        file: createFile('b.png', 'image/png'),
        previewUrl: 'blob:b',
      },
    ]);

    const promote = fixture.nativeElement.querySelector('button[aria-label="اجعل b.png الصورة الرئيسية"]');
    expect(promote.textContent.trim()).toBe('تعيين كرئيسية');
  });

  it('moves a file to the front when it is made the main image', () => {
    const { fixture, emitted } = render([
      {
        id: 'a',
        name: 'a.png',
        sizeInBytes: 10,
        file: createFile('a.png', 'image/png'),
        previewUrl: 'blob:a',
      },
      {
        id: 'b',
        name: 'b.png',
        sizeInBytes: 10,
        file: createFile('b.png', 'image/png'),
        previewUrl: 'blob:b',
      },
    ]);

    fixture.nativeElement.querySelector('button[aria-label="اجعل b.png الصورة الرئيسية"]').click();

    expect(emitted[0].map((item) => item.id)).toEqual(['b', 'a']);
  });

  it('names each picture for a screen reader, as the design shows no caption', () => {
    const { fixture } = render([
      {
        id: 'a',
        name: 'a.png',
        sizeInBytes: 900,
        file: createFile('a.png', 'image/png'),
        previewUrl: 'blob:a',
      },
    ]);

    const image = fixture.nativeElement.querySelector('li img') as HTMLImageElement;
    expect(image.getAttribute('alt')).toBe('a.png');
    expect(fixture.nativeElement.textContent).not.toContain('ك.ب');
  });

  it('shows one message when several rejected files share the same reason', () => {
    const { fixture } = render();

    drop(fixture, [createFile('a.pdf', 'application/pdf'), createFile('a.pdf', 'application/pdf')]);

    // Repeated strings would also collide as @for track keys.
    const messages = fixture.nativeElement.querySelectorAll('.text-error');
    expect(messages.length).toBe(1);
  });

  it('shows videos in a video element instead of an image', () => {
    const fixture = TestBed.createComponent(MediaPicker);
    fixture.componentRef.setInput('prompt', 'اسحب وأفلت الفيديو هنا');
    fixture.componentRef.setInput('rules', { ...IMAGE_RULES, accepted: ['video/*'] });
    fixture.componentRef.setInput('kind', 'video');
    fixture.componentRef.setInput('files', [
      {
        id: 'v',
        name: 'clip.mp4',
        sizeInBytes: 10,
        file: createFile('clip.mp4', 'video/mp4'),
        previewUrl: 'blob:v',
      },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('li video')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('الصورة الرئيسية');
  });
});
