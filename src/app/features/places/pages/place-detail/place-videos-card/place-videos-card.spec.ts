import { TestBed } from '@angular/core/testing';
import { PlaceVideosCard } from './place-videos-card';
import { PlaceVideo } from '../../../models/place-video';

const VIDEO: PlaceVideo = {
  id: 'video-1',
  url: 'tour.mp4',
  posterUrl: 'assets/images/place-cover.jpg',
  duration: '01:24',
};

function build(videos: PlaceVideo[]) {
  const fixture = TestBed.createComponent(PlaceVideosCard);
  fixture.componentRef.setInput('videos', videos);
  fixture.detectChanges();
  return fixture;
}

describe('PlaceVideosCard', () => {
  it('shows the heading, the subtitle and the add button', () => {
    const text = build([]).nativeElement.textContent;

    expect(text).toContain('معرض الفيديوهات');
    expect(text).toContain('الفيديوهات التعريفية للمكان');
    expect(text).toContain('إضافة فيديو');
  });

  it('shows a poster with its duration instead of a bare player', () => {
    const fixture = build([VIDEO]);

    const poster: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(poster.getAttribute('src')).toBe('assets/images/place-cover.jpg');
    expect(fixture.nativeElement.textContent).toContain('01:24');
    expect(fixture.nativeElement.querySelector('video')).toBeNull();
  });

  it('swaps the poster for a player once the video is started', () => {
    const fixture = build([VIDEO]);
    (fixture.nativeElement.querySelector('[data-testid="play-video"]') as HTMLElement).click();
    fixture.detectChanges();

    const player: HTMLVideoElement = fixture.nativeElement.querySelector('video');
    expect(player.getAttribute('src')).toBe('tour.mp4');
  });

  it('explains that there are no videos yet', () => {
    expect(build([]).nativeElement.textContent).toContain('لا توجد فيديوهات بعد');
  });
});
