import { TestBed } from '@angular/core/testing';
import { toStoryCard } from '../../state/story-card-view';
import { STORY_NOW, buildStory } from '../../testing/merchant-story-fixture';
import { ActiveStoryCard } from './active-story-card';

function build() {
  const fixture = TestBed.createComponent(ActiveStoryCard);
  fixture.componentRef.setInput('card', toStoryCard(buildStory(), STORY_NOW));
  const picked: string[] = [];
  fixture.componentInstance.view.subscribe(() => picked.push('view'));
  fixture.componentInstance.edit.subscribe(() => picked.push('edit'));
  fixture.componentInstance.remove.subscribe(() => picked.push('remove'));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, picked };
}

describe('ActiveStoryCard', () => {
  it('shows the story picture with its status, time left and text', () => {
    const { element } = build();

    expect(element.querySelector('app-story-visual')?.textContent).toContain('نشطة');
    expect(element.querySelector('app-story-visual')?.textContent).toContain('متبقي 14 ساعة');
    expect(element.querySelector('app-story-visual')?.textContent).toContain(
      'وصول دفعة سيرومات فيتامين C الجديدة',
    );
  });

  it('writes the publish time and the views under the picture', () => {
    const { element } = build();

    expect(element.querySelector('[data-role="published"]')?.textContent?.trim()).toBe(
      'اليوم • 10:30 AM',
    );
    expect(element.querySelector('[data-role="views"]')?.textContent?.trim()).toBe('348 مشاهدة');
  });

  it('puts the time first, on the right in RTL, and each icon before its text', () => {
    const footer = build().element.querySelector('[data-role="meta"]')!;
    const [time, views] = [...footer.children];

    expect(time.querySelector('[data-role="published"]')).not.toBeNull();
    expect(views.querySelector('[data-role="views"]')).not.toBeNull();
    expect(time.firstElementChild?.tagName).toBe('APP-ICON');
    expect(views.firstElementChild?.tagName).toBe('APP-ICON');
  });

  it('offers view, edit and delete from its menu', () => {
    const { fixture, element, picked } = build();

    element.querySelector<HTMLElement>('button[aria-haspopup]')!.click();
    fixture.detectChanges();
    const items = element.querySelectorAll<HTMLElement>('[data-testid="action-menu-panel"] button');
    expect(items).toHaveLength(3);
    items[1].click();

    expect(picked).toEqual(['edit']);
  });

  it('opens the story when the card is clicked anywhere', () => {
    const { element, picked } = build();
    const cover = element.querySelector<HTMLButtonElement>('[data-role="open-story"]')!;

    expect(cover.getAttribute('aria-label')).toBe('عرض القصة');
    expect(cover.className).toContain('inset-0');
    cover.click();

    expect(picked).toEqual(['view']);
  });

  it('keeps the dots above the cover, so opening the menu does not open the story', () => {
    const { fixture, element, picked } = build();

    expect(element.querySelector('app-story-menu')?.className).toContain('z-[2]');
    element.querySelector<HTMLElement>('button[aria-haspopup]')!.click();
    fixture.detectChanges();

    expect(picked).toEqual([]);
    expect(element.querySelector('[data-testid="action-menu-panel"]')).not.toBeNull();
  });
});
