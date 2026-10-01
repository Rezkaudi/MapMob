import { TestBed } from '@angular/core/testing';
import { StoryPicture } from '../../models/story-picture';
import { buildStoryPicture } from '../../testing/story-view-fixture';
import { StoryMedia } from './story-media';

function build(story: StoryPicture, isPlaying = false) {
  const fixture = TestBed.createComponent(StoryMedia);
  fixture.componentRef.setInput('story', story);
  fixture.componentRef.setInput('isPlaying', isPlaying);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const VIDEO = buildStoryPicture({ kind: 'video', url: 'https://cdn.example.com/s.mp4' });

describe('StoryMedia', () => {
  it('shows the picture of a picture story, described by its text', () => {
    const picture = build(buildStoryPicture()).querySelector('img')!;

    expect(picture.getAttribute('src')).toBe('https://cdn.example.com/story-1.jpg');
    expect(picture.getAttribute('alt')).toBe('وصول دفعة سيرومات فيتامين C الجديدة');
  });

  it('shows the still frame of a video on a card', () => {
    const element = build({ ...VIDEO, posterUrl: 'https://cdn.example.com/s.jpg' });

    expect(element.querySelector('img')?.getAttribute('src')).toBe('https://cdn.example.com/s.jpg');
    expect(element.querySelector('video')).toBeNull();
  });

  it('falls back to the first frame of the video when the server has no still yet', () => {
    const video = build(VIDEO).querySelector('video')!;

    expect(video.getAttribute('src')).toBe('https://cdn.example.com/s.mp4');
    expect(video.autoplay).toBe(false);
  });

  it('plays a video, muted and looping, where the story is opened', () => {
    const video = build(
      { ...VIDEO, posterUrl: 'https://cdn.example.com/s.jpg' },
      true,
    ).querySelector('video')!;

    expect(video.autoplay).toBe(true);
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.getAttribute('poster')).toBe('https://cdn.example.com/s.jpg');
  });
});
