import { TestBed } from '@angular/core/testing';
import { IconTab } from './icon-tab';
import { IconTabs } from './icon-tabs';

const TABS: readonly IconTab[] = [
  { value: 'sessions', label: 'جلسات الألعاب', icon: 'games', iconSize: 20 },
  { value: 'winners', label: 'الفائزون', icon: 'users-group', iconSize: 16 },
];

function render(selected: string) {
  const fixture = TestBed.createComponent(IconTabs);
  fixture.componentRef.setInput('tabs', TABS);
  fixture.componentRef.setInput('selected', selected);
  fixture.detectChanges();
  const buttons: HTMLButtonElement[] = Array.from(
    fixture.nativeElement.querySelectorAll('[role="tab"]'),
  );
  return { fixture, buttons };
}

describe('IconTabs', () => {
  it('draws each tab with its icon before its label', () => {
    const { buttons } = render('sessions');
    expect(buttons.map((button) => button.textContent?.trim())).toEqual([
      'جلسات الألعاب',
      'الفائزون',
    ]);
    expect(buttons[0].firstElementChild?.tagName).toBe('APP-ICON');
  });

  it('marks the chosen tab', () => {
    const { buttons } = render('winners');
    expect(buttons.map((button) => button.getAttribute('aria-selected'))).toEqual([
      'false',
      'true',
    ]);
    expect(buttons[1].classList).toContain('text-primary');
  });

  it('tells which tab was picked', () => {
    const { fixture, buttons } = render('sessions');
    let picked = '';
    fixture.componentInstance.selectedChange.subscribe((value) => (picked = value));
    buttons[1].click();
    expect(picked).toBe('winners');
  });
});
