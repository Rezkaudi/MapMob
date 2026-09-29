import { TestBed } from '@angular/core/testing';
import { StatusCopy } from '../../models/status-copy';
import { SubscriptionStatusBadge } from './subscription-status-badge';

function render(status: StatusCopy): HTMLElement {
  const fixture = TestBed.createComponent(SubscriptionStatusBadge);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('SubscriptionStatusBadge', () => {
  it('draws the dot first, so RTL puts it on the right of the word', () => {
    const badge = render({ label: 'نشطة', tone: 'success' }).querySelector('span')!;

    expect(badge.children[0].getAttribute('data-role')).toBe('dot');
    expect(badge.textContent?.trim()).toBe('نشطة');
  });

  it('tints the badge by tone', () => {
    expect(render({ label: 'نشطة', tone: 'success' }).innerHTML).toContain('text-status-success');
    expect(render({ label: 'منتهية', tone: 'muted' }).innerHTML).toContain('text-text-secondary');
  });
});
