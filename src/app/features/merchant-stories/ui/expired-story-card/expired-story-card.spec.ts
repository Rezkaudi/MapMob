import { TestBed } from '@angular/core/testing';
import { MerchantStory } from '../../models/merchant-story';
import { toStoryCard } from '../../state/story-card-view';
import { STORY_NOW, buildExpiredStory } from '../../testing/merchant-story-fixture';
import { ExpiredStoryCard } from './expired-story-card';

function build(story: MerchantStory = buildExpiredStory()) {
  const fixture = TestBed.createComponent(ExpiredStoryCard);
  fixture.componentRef.setInput('card', toStoryCard(story, STORY_NOW));
  const picked: string[] = [];
  fixture.componentInstance.view.subscribe(() => picked.push('view'));
  fixture.componentInstance.remove.subscribe(() => picked.push('remove'));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, picked };
}

const textOf = (element: HTMLElement, role: string) =>
  element.querySelector(`[data-role="${role}"]`)?.textContent?.trim();

describe('ExpiredStoryCard', () => {
  it('shows the faded picture with the grey status and the text on one line', () => {
    const { element } = build();

    expect(element.querySelector('app-story-media')?.className).toContain('opacity-80');
    expect(textOf(element, 'status')).toBe('منتهية');
    expect(textOf(element, 'caption')).toBe('عرض نهاية الأسبوع على المرطبات الطبية');
    expect(element.querySelector('[data-role="caption"]')?.className).toContain('truncate');
  });

  it('writes when it went out and when it ended, the publish time first on the right', () => {
    const { element } = build();
    const dates = [...element.querySelectorAll('[data-role="date"]')];

    expect(dates.map((date) => date.querySelector('dt')?.textContent?.trim())).toEqual([
      'وقت النشر',
      'انتهت بتاريخ',
    ]);
    expect(dates.map((date) => date.querySelector('dd')?.textContent?.trim())).toEqual([
      '18 سبتمبر • 02:00 PM',
      '19 سبتمبر • 02:00 PM',
    ]);
  });

  it('counts the views, the eye first on the right', () => {
    const { element } = build();

    expect(textOf(element, 'views')).toBe('680 مشاهدة');
    expect(element.querySelector('[data-role="views-row"]')?.firstElementChild?.tagName).toBe(
      'APP-ICON',
    );
  });

  it('has no text line for a story without text', () => {
    expect(build(buildExpiredStory({ caption: null })).element.querySelector('h3')).toBeNull();
  });

  it('offers only view and delete from its menu', () => {
    const { fixture, element, picked } = build();

    element.querySelector<HTMLElement>('button[aria-haspopup]')!.click();
    fixture.detectChanges();
    const items = element.querySelectorAll<HTMLElement>('[data-testid="action-menu-panel"] button');
    expect([...items].map((item) => item.textContent?.trim())).toEqual(['عرض القصة', 'حذف القصة']);
    items[1].click();

    expect(picked).toEqual(['remove']);
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
