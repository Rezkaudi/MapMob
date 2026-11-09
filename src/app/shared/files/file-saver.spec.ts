import { TestBed } from '@angular/core/testing';
import { FileSaver } from './file-saver';

describe('FileSaver', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('clicks a link in the page that saves the file under the given name', () => {
    Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:users'), revokeObjectURL: vi.fn() });
    const clicked: { link: HTMLAnchorElement; isInPage: boolean }[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clicked.push({ link: this, isInPage: this.isConnected });
    });
    const file = new Blob(['csv']);

    TestBed.inject(FileSaver).save(file, 'users.csv');

    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(clicked[0].link.download).toBe('users.csv');
    expect(clicked[0].link.href).toBe('blob:users');
    expect(clicked[0].isInPage).toBe(true);
    expect(clicked[0].link.isConnected).toBe(false);
  });

  // Safari can cancel the download when the URL is freed in the same moment as the click.
  it('frees the file URL only after the download has started', () => {
    vi.useFakeTimers();
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:users'), revokeObjectURL });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    TestBed.inject(FileSaver).save(new Blob(['csv']), 'users.csv');

    expect(revokeObjectURL).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:users');
  });
});
