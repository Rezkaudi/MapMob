import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CLOCK } from '../../../core/config/clock';
import { NotificationCardView } from '../../models/notification-card-view';
import { NotificationEdgeTone } from '../../models/notification-edge-tone';
import { NotificationCard } from './notification-card';

const NOW = new Date('2026-09-20T10:00:00.000Z');

function buildView(overrides: Partial<NotificationCardView> = {}): NotificationCardView {
  return {
    id: 'n-1',
    title: 'تم تفعيل اشتراكك',
    body: 'تم تفعيل باقة "أساسية" بنجاح.',
    categoryLabel: 'الاشتراكات',
    edgeTone: 'amber',
    receivedAt: '2026-09-20T09:50:00.000Z',
    isRead: false,
    action: null,
    ...overrides,
  };
}

function render(view: NotificationCardView) {
  const fixture = TestBed.createComponent(NotificationCard);
  fixture.componentRef.setInput('notification', view);
  fixture.detectChanges();
  return fixture;
}

const cardOf = (view: NotificationCardView) => render(view).nativeElement as HTMLElement;

describe('NotificationCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: CLOCK, useValue: () => NOW }],
    });
  });

  it('writes the title, category, body and how long ago it arrived', () => {
    const card = cardOf(buildView());

    expect(card.querySelector('h3')?.textContent?.trim()).toBe('تم تفعيل اشتراكك');
    expect(card.querySelector('[data-role="category"]')?.textContent?.trim()).toBe('الاشتراكات');
    expect(card.querySelector('[data-role="time"]')?.textContent?.trim()).toBe('منذ 10 دقائق');
    expect(card.querySelector('[data-role="body"]')?.textContent?.trim()).toBe(
      'تم تفعيل باقة "أساسية" بنجاح.',
    );
  });

  it('marks an unread notification with the blue dot and drops it once read', () => {
    expect(cardOf(buildView()).querySelector('[data-role="unread-dot"]')).not.toBeNull();
    expect(
      cardOf(buildView({ isRead: true })).querySelector('[data-role="unread-dot"]'),
    ).toBeNull();
  });

  it('colours the leading edge from the tone', () => {
    const edge = (edgeTone: NotificationEdgeTone) =>
      (cardOf(buildView({ edgeTone })).firstElementChild as HTMLElement).className.match(
        /border-(?!s-)\S+/,
      )?.[0];

    expect(edge('amber')).toBe('border-[#fbbf24]');
    expect(edge('green')).toBe('border-status-success');
    expect(edge('primary')).toBe('border-primary');
    expect(edge('muted')).toBe('border-text-secondary');
  });

  it('clears the notification through the unread dot', () => {
    const fixture = render(buildView());
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
    const article = cardOf(buildView()).firstElementChild as HTMLElement;

    expect(article.classList.contains('p-4')).toBe(true);
    expect(article.classList.contains('ps-2')).toBe(true);
  });

  it('puts the dot right of the title and the title right of the category tag', () => {
    const group = cardOf(buildView()).querySelector('[data-role="title-group"]') as HTMLElement;

    expect([...group.children].map((child) => child.getAttribute('data-role'))).toEqual([
      'unread-dot',
      null,
      'category',
    ]);
  });

  it('draws no link row when the notification has no action', () => {
    expect(cardOf(buildView()).querySelector('[data-role="action"]')).toBeNull();
  });

  it('links to the action page, text on the right and the 11px arrow on its left', () => {
    const card = cardOf(
      buildView({
        action: { label: 'عرض في صفحة الاشتراكات والباقات', route: '/merchant/subscription' },
      }),
    );
    const link = card.querySelector('a[data-role="action"]') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('/merchant/subscription');
    expect(link.textContent?.trim()).toBe('عرض في صفحة الاشتراكات والباقات');
    expect([...link.children].map((child) => child.tagName.toLowerCase())).toEqual([
      'span',
      'app-icon',
    ]);
    expect(link.querySelector('app-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(link.parentElement?.className).toContain('pt-1.5');
  });

  it('counts following the link as reading an unread notification', () => {
    const fixture = render(
      buildView({ action: { label: 'عرض المراجعة والرد على العميل', route: '/merchant/reviews' } }),
    );
    const asked: number[] = [];
    fixture.componentInstance.markRead.subscribe(() => asked.push(1));

    ((fixture.nativeElement as HTMLElement).querySelector('a') as HTMLAnchorElement).click();

    expect(asked).toEqual([1]);
  });

  it('does not ask again when the notification was already read', () => {
    const fixture = render(
      buildView({
        isRead: true,
        action: { label: 'عرض المراجعة والرد على العميل', route: '/merchant/reviews' },
      }),
    );
    const asked: number[] = [];
    fixture.componentInstance.markRead.subscribe(() => asked.push(1));

    ((fixture.nativeElement as HTMLElement).querySelector('a') as HTMLAnchorElement).click();

    expect(asked).toEqual([]);
  });
});
