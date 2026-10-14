import { TestBed } from '@angular/core/testing';
import { CategoryIconFileMaker } from './category-icon-file-maker';

describe('CategoryIconFileMaker', () => {
  it('gives an SVG file when the browser cannot draw on a canvas', async () => {
    const file = await TestBed.inject(CategoryIconFileMaker).makeFile('coffee', '#FF8104');

    expect(file?.type).toBe('image/svg+xml');
    expect(await file?.text()).toContain('stroke="#FF8104"');
  });

  it('gives nothing for an unknown icon', async () => {
    expect(await TestBed.inject(CategoryIconFileMaker).makeFile('nope', '#FF8104')).toBeNull();
  });
});
