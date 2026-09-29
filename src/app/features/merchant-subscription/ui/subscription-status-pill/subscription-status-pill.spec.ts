import { TestBed } from '@angular/core/testing';
import { StatusCopy } from '../../models/status-copy';
import { SubscriptionStatusPill } from './subscription-status-pill';

function render(status: StatusCopy): HTMLElement {
  const fixture = TestBed.createComponent(SubscriptionStatusPill);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('span');
}

describe('SubscriptionStatusPill', () => {
  it('fills the pill green for an active period and grey for an ended one', () => {
    const active = render({ label: 'نشطة', tone: 'success' });
    const ended = render({ label: 'منتهية', tone: 'muted' });

    expect(active.textContent?.trim()).toBe('نشطة');
    expect(active.classList).toContain('bg-status-success');
    expect(ended.classList).toContain('bg-text-secondary');
  });
});
