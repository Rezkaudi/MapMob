import { formatFileSize, formatLatinFileSize } from './file-size';

describe('formatFileSize', () => {
  it('writes megabytes and kilobytes with one decimal, as the ad form does', () => {
    expect(formatFileSize(1.4 * 1024 * 1024)).toBe('1.4 ميجابايت');
    expect(formatFileSize(512 * 1024)).toBe('512.0 كيلوبايت');
  });
});

describe('formatLatinFileSize', () => {
  it('writes "2.4 MB" and "512.0 KB", as the media cards do', () => {
    expect(formatLatinFileSize(2.4 * 1024 * 1024)).toBe('2.4 MB');
    expect(formatLatinFileSize(512 * 1024)).toBe('512.0 KB');
  });
});
