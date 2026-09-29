import { mediaFormatLabel } from './media-file-format';

describe('mediaFormatLabel', () => {
  it('names the common formats the way the cards write them', () => {
    expect(mediaFormatLabel('image/jpeg')).toBe('JPG');
    expect(mediaFormatLabel('image/png')).toBe('PNG');
    expect(mediaFormatLabel('video/mp4')).toBe('MP4');
    expect(mediaFormatLabel('video/quicktime')).toBe('MOV');
  });

  it('falls back to the upper-case subtype', () => {
    expect(mediaFormatLabel('video/webm')).toBe('WEBM');
  });
});
