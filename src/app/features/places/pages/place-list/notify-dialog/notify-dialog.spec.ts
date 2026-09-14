import { TestBed } from '@angular/core/testing';
import { NotifyDialog } from './notify-dialog';

function build(selectedCount = 5) {
  const fixture = TestBed.createComponent(NotifyDialog);
  fixture.componentRef.setInput('selectedCount', selectedCount);
  fixture.detectChanges();
  return fixture;
}

function typeInto(fixture: ReturnType<typeof build>, selector: string, value: string): void {
  const field = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
  field.value = value;
  field.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

describe('NotifyDialog', () => {
  it('shows the header, the recipients banner and the three fields', () => {
    const text = build().nativeElement.textContent;
    expect(text).toContain('إرسال إشعار جماعي');
    expect(text).toContain(
      'سيتم إرسال هذا التنبيه مباشرة لتطبيقات ولوحات تحكم جميع المتاجر المحددة.',
    );
    expect(text).toContain('المستلمون المستهدفون:');
    expect(text).toContain('5 متاجر');
    expect(text).toContain('عنوان الإشعار');
    expect(text).toContain('نوع وأهمية الإشعار');
    expect(text).toContain('نص الإشعار');
  });

  it('offers the three priorities and starts on the general one', () => {
    const fixture = build();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('عام (تحديثات)');
    expect(text).toContain('مهم (تنبيه)');
    expect(text).toContain('عاجل (طارئ)');

    const checked = fixture.nativeElement.querySelector('input[type="radio"]:checked');
    expect(checked.value).toBe('general');
  });

  it('counts the message characters', () => {
    const fixture = build();
    typeInto(fixture, '#notification-message', 'مرحبا');
    expect(fixture.nativeElement.textContent).toContain('5/500');
  });

  it('keeps sending blocked until a title and a message are written', () => {
    const fixture = build();
    const submit = fixture.nativeElement.querySelector(
      '[data-testid="notify-submit"]',
    ) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);

    typeInto(fixture, '#notification-title', 'تحديث');
    typeInto(fixture, '#notification-message', 'نص الإشعار');
    expect(submit.disabled).toBe(false);
  });

  it('sends the written notification', () => {
    const fixture = build();
    typeInto(fixture, '#notification-title', 'تحديث');
    typeInto(fixture, '#notification-message', 'نص الإشعار');

    const sent: unknown[] = [];
    fixture.componentInstance.sent.subscribe((draft) => sent.push(draft));
    fixture.nativeElement.querySelector('[data-testid="notify-submit"]').click();

    expect(sent).toEqual([
      {
        title: 'تحديث',
        priority: 'general',
        message: 'نص الإشعار',
        shouldSendToDashboard: true,
      },
    ]);
  });

  it('raises cancelled from both the close button and the cancel button', () => {
    const fixture = build();
    let cancelled = 0;
    fixture.componentInstance.cancelled.subscribe(() => (cancelled += 1));

    fixture.nativeElement.querySelector('[data-testid="notify-close"]').click();
    fixture.nativeElement.querySelector('[data-testid="notify-cancel"]').click();

    expect(cancelled).toBe(2);
  });
});
