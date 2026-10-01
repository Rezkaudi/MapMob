import { TestBed } from '@angular/core/testing';
import { StoryStatus } from '../../models/story-status';
import { StoryStatusPill } from './story-status-pill';

function build(status: StoryStatus, label: string) {
  const fixture = TestBed.createComponent(StoryStatusPill);
  fixture.componentRef.setInput('status', status);
  fixture.componentRef.setInput('label', label);
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('[data-role="status"]')!;
}

describe('StoryStatusPill', () => {
  it('paints an active story green, with no icon', () => {
    const pill = build('active', 'نشطة');

    expect(pill.textContent?.trim()).toBe('نشطة');
    expect(pill.className).toContain('bg-status-success');
    expect(pill.querySelector('app-icon')).toBeNull();
  });

  it('paints a story an admin hid amber, with no icon', () => {
    const pill = build('hidden', 'مخفية');

    expect(pill.textContent?.trim()).toBe('مخفية');
    expect(pill.className).toContain('bg-accent');
    expect(pill.querySelector('app-icon')).toBeNull();
  });

  it('paints an expired story grey and leads with the history icon, on the right in RTL', () => {
    const pill = build('expired', 'منتهية');

    expect(pill.textContent?.trim()).toBe('منتهية');
    expect(pill.className).toContain('bg-[#e0e3e5]');
    expect(pill.firstElementChild?.tagName).toBe('APP-ICON');
  });
});
