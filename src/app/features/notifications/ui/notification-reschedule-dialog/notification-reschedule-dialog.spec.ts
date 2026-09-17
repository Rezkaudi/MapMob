import { TestBed } from '@angular/core/testing';
import { CLOCK } from '../../../../core/config/clock';
import { buildNotificationDetailView } from '../../state/notification-detail-view';
import { buildNotification } from '../../testing/notification-fixture';
import { NotificationRescheduleDialog } from './notification-reschedule-dialog';

const NOW = new Date(2026, 8, 8, 10, 0);
const SCHEDULED = buildNotification();

function render() {
  TestBed.configureTestingModule({ providers: [{ provide: CLOCK, useValue: () => NOW }] });
  const fixture = TestBed.createComponent(NotificationRescheduleDialog);
  fixture.componentRef.setInput('notification', SCHEDULED);
  fixture.componentRef.setInput('view', buildNotificationDetailView(SCHEDULED, NOW));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

function change(element: HTMLElement, type: string, value: string): void {
  const input = element.querySelector(`input[type="${type}"]`) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('change'));
}

describe('NotificationRescheduleDialog', () => {
  it('shows the current send time and the new date and time, filled with it', () => {
    const { element } = render();

    expect(element.textContent).toContain('إعادة جدولة الإشعار');
    expect(element.textContent).toContain('قم بتحديد الموعد الجديد لإرسال الإشعار المجدول');
    expect(element.textContent).toContain('تاريخ ووقت الإرسال الحالي');
    expect(element.textContent).toContain('10 سبتمبر 2026- 10:00 صباحاً');
    expect(element.textContent).toContain('متبقي يومين');
    expect(element.textContent).toContain('تحديد الموعد الجديد للإرسال');
    expect(
      Array.from(element.querySelectorAll('[data-role="moment-text"]'), (text) =>
        text.textContent?.trim(),
      ),
    ).toEqual(['09/10/2026', '10:00 AM']);
    expect(
      Array.from(element.querySelectorAll('footer button'), (b) => b.textContent?.trim()),
    ).toEqual(['إلغاء', 'تأكيد إعادة جدولة']);
  });

  it('confirms the new time only once it differs from the current one and is still ahead', () => {
    const { fixture, element } = render();
    const confirmed = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);
    const confirm = () => buttonNamed(element, 'تأكيد إعادة جدولة');

    expect(confirm().disabled).toBe(true);
    change(element, 'date', '2026-09-01');
    fixture.detectChanges();
    expect(confirm().disabled).toBe(true);

    change(element, 'date', '2026-09-18');
    change(element, 'time', '16:30');
    fixture.detectChanges();
    confirm().click();

    expect(confirmed).toHaveBeenCalledWith('2026-09-18T16:30');
  });

  it('goes back to the details from the arrow and from "إلغاء"', () => {
    const { fixture, element } = render();
    const back = vi.fn();
    fixture.componentInstance.back.subscribe(back);

    (element.querySelector('button[aria-label="رجوع"]') as HTMLButtonElement).click();
    buttonNamed(element, 'إلغاء').click();

    expect(back).toHaveBeenCalledTimes(2);
  });
});
