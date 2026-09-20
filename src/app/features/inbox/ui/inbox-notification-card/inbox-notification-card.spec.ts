import { TestBed } from '@angular/core/testing';
import { CLOCK } from '../../../../core/config/clock';
import { InboxNotification } from '../../models/inbox-notification';
import { buildInboxNotification } from '../../testing/inbox-fixture';
import { InboxNotificationCard } from './inbox-notification-card';

const NOW = new Date('2026-09-20T10:00:00.000Z');

function render(notification: InboxNotification): HTMLElement {
  const fixture = TestBed.createComponent(InboxNotificationCard);
  fixture.componentRef.setInput('notification', notification);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('InboxNotificationCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: CLOCK, useValue: () => NOW }] });
  });

  it('writes the title, category, body and how long ago it arrived', () => {
    const card = render(buildInboxNotification());

    expect(card.querySelector('h3')?.textContent?.trim()).toBe('بلاغ جديد');
    expect(card.querySelector('[data-role="category"]')?.textContent?.trim()).toBe('البلاغات');
    expect(card.querySelector('[data-role="time"]')?.textContent?.trim()).toBe('منذ 10 دقائق');
    expect(card.querySelector('[data-role="body"]')?.textContent?.trim()).toBe(
      'تم استلام بلاغ جديد على متجر صيدلية الشفاء ويحتاج إلى المراجعة.',
    );
  });

  it('marks an unread notification with the blue dot and drops it once read', () => {
    expect(
      render(buildInboxNotification()).querySelector('[data-role="unread-dot"]'),
    ).not.toBeNull();
    expect(
      render(buildInboxNotification({ isRead: true })).querySelector('[data-role="unread-dot"]'),
    ).toBeNull();
  });

  it('colours the leading edge from the category, as the design does', () => {
    const edge = (notification: InboxNotification) =>
      (render(notification).firstElementChild as HTMLElement).className.match(
        /border-(?!s-)\S+/,
      )?.[0];

    expect(edge(buildInboxNotification({ category: 'complaints' }))).toBe('border-[#fbbf24]');
    expect(edge(buildInboxNotification({ category: 'subscriptions' }))).toBe(
      'border-status-success',
    );
  });

  it('clears the notification through the unread dot, the only control the design draws', () => {
    const fixture = TestBed.createComponent(InboxNotificationCard);
    fixture.componentRef.setInput('notification', buildInboxNotification());
    fixture.detectChanges();
    const asked: number[] = [];
    fixture.componentInstance.markRead.subscribe(() => asked.push(1));

    const dot = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="unread-dot"]',
    ) as HTMLButtonElement;

    expect(dot.tagName).toBe('BUTTON');
    expect(dot.getAttribute('aria-label')).toBe('تحديد كمقروء');

    dot.click();
    expect(asked).toEqual([1]);
  });

  it('pads one border-width less on the edge it draws, so content lands where the design has it', () => {
    const article = render(buildInboxNotification()).firstElementChild as HTMLElement;

    expect(article.classList.contains('p-4')).toBe(true);
    expect(article.classList.contains('ps-2')).toBe(true);
  });

  it('puts the dot right of the title and the title right of the category tag', () => {
    const card = render(buildInboxNotification());
    const group = card.querySelector('[data-role="title-group"]') as HTMLElement;

    expect([...group.children].map((child) => child.getAttribute('data-role'))).toEqual([
      'unread-dot',
      null,
      'category',
    ]);
  });
});
