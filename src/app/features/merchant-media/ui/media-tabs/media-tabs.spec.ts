import { TestBed } from '@angular/core/testing';
import { MediaTabView } from '../../models/media-tab-view';
import { MediaTabs } from './media-tabs';

const FULL: readonly MediaTabView[] = [
  { value: 'all', label: 'الكل', icon: 'grid-four', count: 3 },
  { value: 'images', label: 'الصور', icon: 'media', count: 3 },
  { value: 'videos', label: 'الفيديوهات', icon: 'video', count: 0 },
];

function build(tabs: readonly MediaTabView[] = FULL) {
  const fixture = TestBed.createComponent(MediaTabs);
  fixture.componentRef.setInput('tabs', tabs);
  fixture.componentRef.setInput('selected', 'all');
  fixture.detectChanges();
  return fixture;
}

const tabsOf = (fixture: ReturnType<typeof build>) =>
  [...fixture.nativeElement.querySelectorAll('[role="tab"]')] as HTMLElement[];

describe('MediaTabs', () => {
  it('marks the picked tab and lists the rest', () => {
    const tabs = tabsOf(build());

    expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(tabs[0].className).toContain('border-primary');
  });

  it('writes a count badge only where there is something to count', () => {
    const badges = tabsOf(build()).map(
      (tab) => tab.querySelector('[data-role="count"]')?.textContent?.trim() ?? null,
    );

    expect(badges).toEqual(['3', '3', null]);
  });

  it('draws idle tabs bold beside counts and medium on an empty gallery, as the two frames do', () => {
    expect(tabsOf(build())[1].className).toContain('font-bold');

    const empty = FULL.map((tab) => ({ ...tab, count: 0 }));
    expect(tabsOf(build(empty))[1].className).toContain('font-medium');
  });

  it('asks for the tab that was clicked', () => {
    const fixture = build();
    const picked: string[] = [];
    fixture.componentInstance.selectTab.subscribe((tab) => picked.push(tab));

    tabsOf(fixture)[2].click();

    expect(picked).toEqual(['videos']);
  });
});
