import { formatFileSize } from './file-size';

describe('formatFileSize', () => {
  it('writes megabytes and kilobytes with one decimal, as the ad form does', () => {
    expect(formatFileSize(1.4 * 1024 * 1024)).toBe('1.4 ميجابايت');
    expect(formatFileSize(512 * 1024)).toBe('512.0 كيلوبايت');
  });
});
