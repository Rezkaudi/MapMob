import { TestBed } from '@angular/core/testing';
import { SendTiming } from '../../models/send-timing';
import { NotificationSendTiming } from './notification-send-timing';

function render(timing: SendTiming = 'now') {
  const fixture = TestBed.createComponent(NotificationSendTiming);
  fixture.componentRef.setInput('timing', timing);
  fixture.componentRef.setInput('sendDay', '2026-05-18');
  fixture.componentRef.setInput('sendTime', '20:00');
  fixture.componentRef.setInput('error', null);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('NotificationSendTiming', () => {
  it('offers a send now and a later send whose date and time sit inside its card', () => {
    const { element } = render();
    const radios = element.querySelectorAll('[role="radio"]');

    expect(radios[0].textContent).toContain('إرسال فوري الآن');
    expect(radios[0].textContent).toContain(
      'سيتم الإرسال لكافة الأجهزة المستهدفة في غضون دقيقة واحدة من تأكيد الضغط.',
    );
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[1].textContent).toContain('جدولة الإشعار لاحقاً');
    expect(radios[1].textContent).toContain('تحديد وقت وتاريخ الذروة لضمان فتح الإشعار بنسبة أعلى');
    expect(
      Array.from(
        element.querySelectorAll(
          '[data-role="later-card"] app-send-moment-field label > span:first-child',
        ),
        (label) => label.textContent?.trim(),
      ),
    ).toEqual(['تاريخ الإرسال', 'ساعة الإرسال (توقيت دمشق)']);
  });

  it('switches to a later send when its card or one of its fields is used', () => {
    const { fixture, element } = render();
    const timingChange = vi.fn();
    const sendDayChange = vi.fn();
    fixture.componentInstance.timingChange.subscribe(timingChange);
    fixture.componentInstance.sendDayChange.subscribe(sendDayChange);

    (element.querySelectorAll('[role="radio"]')[1] as HTMLElement).click();
    const day = element.querySelector('input[type="date"]') as HTMLInputElement;
    day.value = '2026-09-20';
    day.dispatchEvent(new Event('change'));

    expect(timingChange.mock.calls).toEqual([['later'], ['later']]);
    expect(sendDayChange).toHaveBeenCalledWith('2026-09-20');
  });

  it('marks the later card picked', () => {
    const { element } = render('later');

    expect(element.querySelectorAll('[role="radio"]')[1].getAttribute('aria-checked')).toBe('true');
    expect(element.querySelector('[data-role="later-card"]')?.classList).toContain(
      'border-primary',
    );
  });
});
