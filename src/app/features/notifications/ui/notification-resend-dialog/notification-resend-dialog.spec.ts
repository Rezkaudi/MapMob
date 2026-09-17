import { TestBed } from '@angular/core/testing';
import { CLOCK } from '../../../../core/config/clock';
import { buildNotificationDetailView } from '../../state/notification-detail-view';
import { buildNotification } from '../../testing/notification-fixture';
import { NotificationResendDialog } from './notification-resend-dialog';

const NOW = new Date(2026, 8, 8, 10, 25);
const SENT = buildNotification({ status: 'sent', sendAt: '2026-09-01T10:00' });

function render() {
  TestBed.configureTestingModule({ providers: [{ provide: CLOCK, useValue: () => NOW }] });
  const fixture = TestBed.createComponent(NotificationResendDialog);
  fixture.componentRef.setInput('notification', SENT);
  fixture.componentRef.setInput('view', buildNotificationDetailView(SENT, NOW));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find((button) =>
    button.textContent?.trim().startsWith(label),
  ) as HTMLButtonElement;
}

describe('NotificationResendDialog', () => {
  it('sums up the notification and opens on a scheduled resend, filled with tomorrow', () => {
    const { element } = render();

    expect(element.textContent).toContain('إعادة إرسال الإشعار');
    expect(element.textContent).toContain('تحديد موعد إعادة إرسال الإشعار للمستخدمين');
    expect(element.textContent).toContain('عروض جديدة بالقرب منك');
    expect(element.textContent).toContain('1,250 مستخدم');
    expect(element.textContent).toContain('موعد إعادة الإرسال');
    expect(
      Array.from(element.querySelectorAll('[role="radio"]'), (radio) => [
        radio.querySelector('.font-bold')?.textContent?.trim(),
        radio.getAttribute('aria-checked'),
      ]),
    ).toEqual([
      ['إرسال فوري الآن', 'false'],
      ['جدولة الإرسال', 'true'],
    ]);
    expect(element.textContent).toContain('تحديد تاريخ ووقت الإرسال للإشعار المجدول');
    expect(
      Array.from(element.querySelectorAll('[data-role="moment-text"]'), (text) =>
        text.textContent?.trim(),
      ),
    ).toEqual(['09/09/2026', '10:00 AM']);
    expect(
      Array.from(element.querySelectorAll('footer button'), (b) => b.textContent?.trim()),
    ).toEqual(['حذف الإشعار', 'إعادة إرسال الإشعار']);
  });

  it('resends at the picked time, or straight away with the time fields hidden', () => {
    const { fixture, element } = render();
    const confirmed = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);

    buttonNamed(element.querySelector('footer')!, 'إعادة إرسال الإشعار').click();
    buttonNamed(element, 'إرسال فوري الآن').click();
    fixture.detectChanges();
    expect(element.querySelector('app-send-moment-field')).toBeNull();
    buttonNamed(element.querySelector('footer')!, 'إعادة إرسال الإشعار').click();

    expect(confirmed.mock.calls).toEqual([['2026-09-09T10:00'], [null]]);
  });

  it('reports the delete and the close', () => {
    const { fixture, element } = render();
    const remove = vi.fn();
    const closed = vi.fn();
    fixture.componentInstance.remove.subscribe(remove);
    fixture.componentInstance.closed.subscribe(closed);

    buttonNamed(element, 'حذف الإشعار').click();
    (element.querySelector('button[aria-label="إغلاق النافذة"]') as HTMLButtonElement).click();

    expect(remove).toHaveBeenCalledOnce();
    expect(closed).toHaveBeenCalledOnce();
  });
});
