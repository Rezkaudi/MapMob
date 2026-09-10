import { TestBed } from '@angular/core/testing';
import { PlaceVideosCard } from './place-videos-card';

describe('PlaceVideosCard', () => {
  it('shows the heading, the subtitle and the add button', () => {
    const fixture = TestBed.createComponent(PlaceVideosCard);
    fixture.componentRef.setInput('videos', []);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('معرض الفيديوهات');
    expect(text).toContain('الفيديوهات التعريفية للمكان');
    expect(text).toContain('إضافة فيديو');
  });

  it('renders one player per video', () => {
    const fixture = TestBed.createComponent(PlaceVideosCard);
    fixture.componentRef.setInput('videos', ['one.mp4', 'two.mp4']);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('video').length).toBe(2);
  });

  it('explains that there are no videos yet', () => {
    const fixture = TestBed.createComponent(PlaceVideosCard);
    fixture.componentRef.setInput('videos', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لا توجد فيديوهات بعد');
  });
});
