import { TestBed } from '@angular/core/testing';
import { NotificationAudience } from '../../models/notification-audience';
import { RecipientMode } from '../../models/recipient-mode';
import { NotificationAudiencePicker } from './notification-audience-picker';

function render(
  audience: NotificationAudience = 'users',
  recipientMode: RecipientMode = 'location',
) {
  const fixture = TestBed.createComponent(NotificationAudiencePicker);
  fixture.componentRef.setInput('audience', audience);
  fixture.componentRef.setInput('recipientMode', recipientMode);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function cardsIn(element: HTMLElement, groupName: string): HTMLElement[] {
  return Array.from(
    element.querySelectorAll<HTMLElement>(
      `[role="radiogroup"][aria-label="${groupName}"] [role="radio"]`,
    ),
  );
}

function titles(cards: HTMLElement[]): (string | undefined)[] {
  return cards.map((card) => card.querySelector('[data-role="title"]')?.textContent?.trim());
}

describe('NotificationAudiencePicker', () => {
  it('offers users or stores, then how to pick the recipients, right to left', () => {
    const { element } = render();

    expect(titles(cardsIn(element, 'الفئة المستهدفة'))).toEqual(['المستخدمون', 'الشركات والمتاجر']);
    expect(element.textContent).toContain('إرسال الإشعار إلى مستخدمي التطبيق');
    expect(element.textContent).toContain('إرسال الإشعار إلى الشركات والمتاجر المسجلة');
    expect(titles(cardsIn(element, 'تحديد المستلمين'))).toEqual([
      'جميع المستخدمين',
      'مستخدمين محددين',
      'مخصص حسب الموقع',
    ]);
    expect(cardsIn(element, 'تحديد المستلمين')[2].getAttribute('aria-checked')).toBe('true');
  });

  it('names the recipient choices after stores once stores are picked', () => {
    const { element } = render('companies', 'all');

    expect(titles(cardsIn(element, 'تحديد المستلمين'))).toEqual([
      'جميع الشركات والمتاجر',
      'شركات ومتاجر محددة',
      'مخصص حسب الموقع',
    ]);
  });

  it('reports each pick', () => {
    const { fixture, element } = render();
    const audienceChange = vi.fn();
    const recipientModeChange = vi.fn();
    fixture.componentInstance.audienceChange.subscribe(audienceChange);
    fixture.componentInstance.recipientModeChange.subscribe(recipientModeChange);

    cardsIn(element, 'الفئة المستهدفة')[1].click();
    cardsIn(element, 'تحديد المستلمين')[1].click();

    expect(audienceChange).toHaveBeenCalledWith('companies');
    expect(recipientModeChange).toHaveBeenCalledWith('selected');
  });
});
