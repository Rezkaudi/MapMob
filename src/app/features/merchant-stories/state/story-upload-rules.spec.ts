import { STORY_ACCEPTED_TYPES, findStoryFileError, storyKindOf } from './story-upload-rules';

const file = (name: string, type: string, megabytes = 1) => {
  const picked = new File(['x'], name, { type });
  Object.defineProperty(picked, 'size', { value: megabytes * 1024 * 1024 });
  return picked;
};

describe('story upload rules', () => {
  it('takes a JPG or PNG up to 5 MB and a video up to 50 MB', () => {
    expect(findStoryFileError(file('a.jpg', 'image/jpeg'))).toBeNull();
    expect(findStoryFileError(file('a.png', 'image/png', 5))).toBeNull();
    expect(findStoryFileError(file('a.mp4', 'video/mp4', 50))).toBeNull();
  });

  it('refuses a file that is too big for its kind', () => {
    expect(findStoryFileError(file('a.jpg', 'image/jpeg', 6))).toBe(
      'a.jpg: الحد الأقصى لحجم الصورة 5 ميجابايت',
    );
    expect(findStoryFileError(file('a.mp4', 'video/mp4', 51))).toBe(
      'a.mp4: الحد الأقصى لحجم الفيديو 50 ميجابايت',
    );
  });

  it('refuses anything that is not a picture or a video', () => {
    expect(findStoryFileError(file('a.pdf', 'application/pdf'))).toBe(
      'a.pdf: يُسمح بصور JPG و PNG وملفات الفيديو فقط',
    );
    expect(findStoryFileError(file('a.gif', 'image/gif'))).toBe(
      'a.gif: يُسمح بصور JPG و PNG وملفات الفيديو فقط',
    );
  });

  it('reads the kind from the file type', () => {
    expect(storyKindOf(file('a.mp4', 'video/mp4'))).toBe('video');
    expect(storyKindOf(file('a.png', 'image/png'))).toBe('image');
  });

  it('lists the types for the file picker', () => {
    expect(STORY_ACCEPTED_TYPES).toBe('image/jpeg,image/png,video/*');
  });
});
