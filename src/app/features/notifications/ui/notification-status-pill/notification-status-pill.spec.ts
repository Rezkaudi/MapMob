import { TestBed } from '@angular/core/testing';
import { NotificationStatus } from '../../models/notification-status';
import { NotificationStatusPill } from './notification-status-pill';

function render(status: NotificationStatus): HTMLElement {
  const fixture = TestBed.createComponent(NotificationStatusPill);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('span');
}

describe('NotificationStatusPill', () => {
  it('shows each status in its own colour', () => {
    expect(render('sent').textContent?.trim()).toBe('مُرسل');
    expect(render('sent').className).toContain('bg-status-success');
    expect(render('scheduled').textContent?.trim()).toBe('مجدول');
    expect(render('scheduled').className).toContain('bg-accent');
    expect(render('draft').textContent?.trim()).toBe('مسودة');
    expect(render('draft').className).toContain('bg-text-secondary');
  });
});
