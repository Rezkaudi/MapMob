import { TestBed } from '@angular/core/testing';
import { StoryVisualCard } from '../../models/story-visual-card';
import {
  buildExpiredStoryVisualCard,
  buildHiddenStoryVisualCard,
  buildStoryVisualCard,
} from '../../testing/story-view-fixture';
import { StoryVisual, StoryVisualSize } from './story-visual';

function build(card: StoryVisualCard, size: StoryVisualSize = 'card') {
  const fixture = TestBed.createComponent(StoryVisual);
  fixture.componentRef.setInput('card', card);
  fixture.componentRef.setInput('size', size);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const roleOf = (element: HTMLElement, role: string) =>
  element.querySelector<HTMLElement>(`[data-role="${role}"]`);

describe('StoryVisual', () => {
  it('draws the 9:16 picture under the contrast gradient', () => {
    const element = build(buildStoryVisualCard());

    expect(roleOf(element, 'frame')?.className).toContain('aspect-[9/16]');
    expect(element.querySelector('app-story-media img')).not.toBeNull();
    expect(roleOf(element, 'gradient')).not.toBeNull();
  });

  it('shows the status, the time left and the text over an active story', () => {
    const element = build(buildStoryVisualCard());

    expect(roleOf(element, 'status')?.textContent?.trim()).toBe('نشطة');
    expect(roleOf(element, 'remaining')?.textContent?.trim()).toBe('متبقي 14 ساعة');
    expect(roleOf(element, 'caption')?.textContent?.trim()).toBe(
      'وصول دفعة سيرومات فيتامين C الجديدة',
    );
  });

  it('leads the time left with its clock, so RTL puts the clock on the right', () => {
    const remaining = roleOf(build(buildStoryVisualCard()), 'remaining')!;

    expect(remaining.firstElementChild?.tagName).toBe('APP-ICON');
  });

  it('has no time left on an expired story and no box for a story without text', () => {
    const element = build(buildExpiredStoryVisualCard({ caption: null }));

    expect(roleOf(element, 'status')?.textContent?.trim()).toBe('منتهية');
    expect(roleOf(element, 'remaining')).toBeNull();
    expect(roleOf(element, 'caption')).toBeNull();
  });

  it('names a story an admin hid, without counting its time down', () => {
    const element = build(buildHiddenStoryVisualCard());

    expect(roleOf(element, 'status')?.textContent?.trim()).toBe('مخفية');
    expect(roleOf(element, 'remaining')).toBeNull();
  });

  it('writes the text at 18px on a card and 14px in the drawer, where it also plays a video', () => {
    expect(roleOf(build(buildStoryVisualCard()), 'caption')?.className).toContain(
      'text-[18px]/[29.25px]',
    );

    const preview = build(buildStoryVisualCard({}, { kind: 'video' }), 'preview');
    expect(roleOf(preview, 'caption')?.className).toContain('text-[14px]/[29.25px]');
    expect(preview.querySelector('video')?.autoplay).toBe(true);
  });

  it('hangs the status 20px down on a card and 16px down in the drawer, as each frame does', () => {
    const pillOf = (size: StoryVisualSize) =>
      build(buildStoryVisualCard(), size).querySelector('app-story-status-pill')!.className;

    expect(pillOf('card')).toContain('top-5');
    expect(pillOf('preview')).toContain('top-4');
  });
});
