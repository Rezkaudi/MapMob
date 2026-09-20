import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { InboxTab } from '../../models/inbox-tab';
import { InboxTabs } from './inbox-tabs';

function render(selected: InboxTab, unreadCount = 1): ComponentFixture<InboxTabs> {
  const fixture = TestBed.createComponent(InboxTabs);
  fixture.componentRef.setInput('selected', selected);
  fixture.componentRef.setInput('unreadCount', unreadCount);
  fixture.detectChanges();
  return fixture;
}

function tabsOf(fixture: ComponentFixture<InboxTabs>): HTMLButtonElement[] {
  return [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')];
}

describe('InboxTabs', () => {
  it('lists the three tabs, الكل first so RTL puts it on the right', () => {
    expect(tabsOf(render('all')).map((tab) => tab.textContent?.trim())).toEqual([
      'الكل',
      'مقروءة',
      'غير مقروءة (1)',
    ]);
  });

  it('packs the tabs against the right edge, under the page title', () => {
    const row = (render('all').nativeElement as HTMLElement).querySelector(
      '[role="tablist"]',
    ) as HTMLElement;

    // RTL flips flex-end to the left, so the frame's right-aligned row is justify-start here.
    expect(row.classList.contains('justify-start')).toBe(true);
    expect(row.classList.contains('justify-end')).toBe(false);
  });

  it('counts the unread ones in the غير مقروءة label', () => {
    expect(tabsOf(render('all', 7))[2].textContent?.trim()).toBe('غير مقروءة (7)');
  });

  it('underlines and tints only the selected tab', () => {
    const tabs = tabsOf(render('read'));

    expect(tabs[1].className).toContain('border-primary');
    expect(tabs[1].className).toContain('text-primary');
    expect(tabs[0].className).toContain('border-transparent');
    expect(tabs[0].className).toContain('text-text-secondary');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('reports the tab the admin picked', () => {
    const fixture = render('all');
    const picked: InboxTab[] = [];
    fixture.componentInstance.selectTab.subscribe((tab) => picked.push(tab));

    tabsOf(fixture)[2].click();

    expect(picked).toEqual(['unread']);
  });
});
