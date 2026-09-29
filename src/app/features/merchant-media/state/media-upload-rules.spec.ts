import { PICTURE_RULES } from '../../../shared/files/picture-rules';
import { VIDEO_RULES } from '../../../shared/files/video-rules';
import { MEDIA_UPLOAD_RULES } from './media-upload-rules';

describe('MEDIA_UPLOAD_RULES', () => {
  it('uses the shared picture and video rules', () => {
    expect(MEDIA_UPLOAD_RULES.image).toBe(PICTURE_RULES);
    expect(MEDIA_UPLOAD_RULES.video).toBe(VIDEO_RULES);
  });
});
