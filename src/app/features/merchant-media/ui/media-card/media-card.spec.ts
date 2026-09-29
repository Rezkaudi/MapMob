import { TestBed } from '@angular/core/testing';
import { toMediaCard } from '../../state/media-card-view';
import { buildMediaItem, buildMediaVideo } from '../../testing/merchant-media-fixture';
import { MediaCardView } from '../../models/media-card-view';
import { MediaCard } from './media-card';

function build(card: MediaCardView = toMediaCard(buildMediaItem())) {
  const fixture = TestBed.createComponent(MediaCard);
  fixture.componentRef.setInput('card', card);
  fixture.detectChanges();
  return fixture;
}

function openMenu(fixture: ReturnType<typeof build>): HTMLElement[] {
  fixture.nativeElement.querySelector('button[aria-haspopup]').click();
  fixture.detectChanges();
  return [...fixture.nativeElement.querySelectorAll('[data-testid="action-menu-panel"] button')];
}

describe('MediaCard', () => {
  it('writes the kind, the format and size, and the day it was added', () => {
    const element: HTMLElement = build().nativeElement;

    expect(element.querySelector('[data-role="kind"]')?.textContent?.trim()).toBe('صورة');
    expect(element.querySelector('[data-role="file"]')?.textContent?.trim()).toBe('JPG · 2.4 MB');
    expect(element.querySelector('[data-role="added"]')?.textContent?.trim()).toBe(
      'أضيف في 12 سبتمبر 2026',
    );
    expect(element.querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.example.com/media-1.jpg',
    );
  });

  it('flags only the main picture', () => {
    expect(build().nativeElement.querySelector('[data-role="main-badge"]')).toBeNull();

    const main = build(toMediaCard(buildMediaItem({ isMain: true })));
    expect(main.nativeElement.querySelector('[data-role="main-badge"]')?.textContent?.trim()).toBe(
      'الصورة الرئيسية',
    );
  });

  it('shows a video by its poster under a play mark', () => {
    const element: HTMLElement = build(toMediaCard(buildMediaVideo())).nativeElement;

    expect(element.querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.example.com/media-video.jpg',
    );
    expect(element.querySelector('[data-role="play"]')).not.toBeNull();
  });

  it('shows the first frame of a video that has no poster yet', () => {
    const element: HTMLElement = build(
      toMediaCard(buildMediaVideo({ posterUrl: null })),
    ).nativeElement;

    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('video')?.getAttribute('src')).toBe(
      'https://cdn.example.com/media-video.mp4',
    );
  });

  it('offers to replace or delete from its menu', () => {
    const fixture = build();
    let removeCount = 0;
    fixture.componentInstance.remove.subscribe(() => removeCount++);

    const items = openMenu(fixture);
    expect(items.map((item) => item.textContent?.trim())).toEqual(['استبدال الصورة', 'حذف']);
    items[1].click();

    expect(removeCount).toBe(1);
  });

  it('opens a file picker for the replacement and hands on the picked file', () => {
    const fixture = build();
    const picked: File[] = [];
    fixture.componentInstance.replaceFile.subscribe((file) => picked.push(file));
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    let pickerOpenCount = 0;
    input.click = () => pickerOpenCount++;

    openMenu(fixture)[0].click();
    const file = new File(['x'], 'front.jpg', { type: 'image/jpeg' });
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));

    expect(pickerOpenCount).toBe(1);
    expect(input.getAttribute('accept')).toBe('image/jpeg,image/png');
    expect(picked).toEqual([file]);
  });
});
