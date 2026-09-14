import { TestBed } from '@angular/core/testing';
import { buildUser } from '../../testing/user-fixture';
import { UserDialogs } from './user-dialogs';

function render(request: unknown) {
  const fixture = TestBed.createComponent(UserDialogs);
  fixture.componentRef.setInput('request', request);
  fixture.detectChanges();
  return fixture;
}

describe('UserDialogs', () => {
  it('shows nothing without a request', () => {
    expect(render(null).nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('asks before suspending, and reports the answer', () => {
    const fixture = render({ type: 'confirm', action: 'suspend', entry: buildUser() });
    const confirmed = vi.fn();
    const closed = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);
    fixture.componentInstance.closed.subscribe(closed);
    const element = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(element.querySelectorAll('button'));

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إيقاف الحساب');
    buttons.find((button) => button.textContent?.trim() === 'إيقاف الحساب')?.click();
    buttons.find((button) => button.textContent?.trim() === 'إلغاء')?.click();

    expect(confirmed).toHaveBeenCalledOnce();
    expect(closed).toHaveBeenCalledOnce();
  });
});
