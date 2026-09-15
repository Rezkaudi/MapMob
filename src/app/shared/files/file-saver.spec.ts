import { TestBed } from '@angular/core/testing';
import { FileSaver } from './file-saver';

describe('FileSaver', () => {
  it('saves the file under the given name and frees its URL', () => {
    const createObjectURL = vi.fn(() => 'blob:users');
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    const clicked: HTMLAnchorElement[] = [];
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clicked.push(this);
    });
    const file = new Blob(['csv']);

    TestBed.inject(FileSaver).save(file, 'users.csv');

    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(clicked[0].download).toBe('users.csv');
    expect(clicked[0].href).toBe('blob:users');
    expect(clicked[0].isConnected).toBe(false);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:users');
    click.mockRestore();
  });
});
