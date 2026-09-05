import { findFileError } from './file-rules';

const IMAGE_RULES = {
  maxBytes: 5 * 1024 * 1024,
  accepted: ['image/jpeg', 'image/png'],
  typeMessage: 'يُسمح بصيغ JPG و PNG فقط',
  sizeMessage: 'الحد الأقصى لحجم الملف 5 ميجابايت',
};

function createFile(name: string, type: string, sizeInBytes: number): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeInBytes });
  return file;
}

describe('findFileError', () => {
  it('accepts a file that matches the type and fits the size', () => {
    expect(findFileError(createFile('shop.png', 'image/png', 1000), IMAGE_RULES)).toBeNull();
  });

  it('rejects a type that is not allowed, naming the file', () => {
    const error = findFileError(createFile('notes.pdf', 'application/pdf', 1000), IMAGE_RULES);

    expect(error).toContain('notes.pdf');
    expect(error).toContain('يُسمح بصيغ JPG و PNG فقط');
  });

  it('rejects a file that is over the size limit', () => {
    const tooBig = createFile('shop.png', 'image/png', 6 * 1024 * 1024);

    expect(findFileError(tooBig, IMAGE_RULES)).toContain('الحد الأقصى');
  });

  it('matches a wildcard type such as video/*', () => {
    const rules = { ...IMAGE_RULES, accepted: ['video/*'] };

    expect(findFileError(createFile('clip.mp4', 'video/mp4', 10), rules)).toBeNull();
    expect(findFileError(createFile('shop.png', 'image/png', 10), rules)).not.toBeNull();
  });
});
