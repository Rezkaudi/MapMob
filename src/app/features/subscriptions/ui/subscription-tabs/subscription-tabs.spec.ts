import { TestBed } from '@angular/core/testing';
import { SubscriptionTab } from '../../models/subscription-tab';
import { SubscriptionTabs } from './subscription-tabs';

function render(selected: SubscriptionTab = 'packages') {
  const fixture = TestBed.createComponent(SubscriptionTabs);
  fixture.componentRef.setInput('selected', selected);
  fixture.componentRef.setInput('packageCount', 3);
  fixture.componentRef.setInput('recordCount', 1280);
  fixture.detectChanges();
  return fixture;
}

function tabs(fixture: ReturnType<typeof render>): HTMLButtonElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
}

describe('SubscriptionTabs', () => {
  it('lists the packages tab first, as the design reads it right to left', () => {
    const [packages, records] = tabs(render());

    expect(packages.textContent).toContain('باقات الاشتراك');
    expect(records.textContent).toContain('سجل المشتركين');
  });

  it('groups the record count in thousands', () => {
    expect(tabs(render())[1].textContent).toContain('1,280');
  });

  it('marks only the selected tab', () => {
    const [packages, records] = tabs(render('records'));

    expect(records.getAttribute('aria-selected')).toBe('true');
    expect(packages.getAttribute('aria-selected')).toBe('false');
  });

  it('underlines the selected tab without tinting it, as the packages frame draws it', () => {
    const [packages, records] = tabs(render());

    expect(packages.classList).toContain('border-primary');
    expect(packages.classList).not.toContain('bg-[#EFF8FF]/40');
    expect(records.classList).toContain('border-transparent');
  });

  it('asks for the tab that was clicked', () => {
    const fixture = render();
    let picked: SubscriptionTab | null = null;
    fixture.componentInstance.selectedChange.subscribe((tab: SubscriptionTab) => (picked = tab));

    tabs(fixture)[1].click();

    expect(picked).toBe('records');
  });
});
