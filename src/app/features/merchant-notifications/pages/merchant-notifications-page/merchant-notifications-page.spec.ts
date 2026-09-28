import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { OwnerNotificationsRepository } from '../../data/owner-notifications.repository';
import { OwnerNotification } from '../../models/owner-notification';
import { buildOwnerNotification } from '../../testing/owner-notification-fixture';
import { MerchantNotificationsPage } from './merchant-notifications-page';

const NOW = new Date('2026-09-29T10:00:00.000Z');
const UNREAD = buildOwnerNotification({ id: 'a' });
const READ_REVIEW = buildOwnerNotification({
  id: 'b',
  category: 'reviews',
  title: 'لديك تقييم جديد من عميل',
  isRead: true,
});

function createPage(
  getNotifications: () => ReturnType<OwnerNotificationsRepository['getNotifications']> = () =>
    of([UNREAD, READ_REVIEW] as readonly OwnerNotification[]),
) {
  const readIds: string[] = [];
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: CLOCK, useValue: () => NOW },
      {
        provide: OwnerNotificationsRepository,
        useValue: {
          getNotifications,
          markAsRead: (id: string) => {
            readIds.push(id);
            return of({ ...UNREAD, id, isRead: true });
          },
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(MerchantNotificationsPage);
  fixture.detectChanges();
  return { fixture, readIds };
}

const elementOf = (fixture: ComponentFixture<MerchantNotificationsPage>) =>
  fixture.nativeElement as HTMLElement;

describe('MerchantNotificationsPage', () => {
  it('heads the page the way the merchant frame words it', () => {
    const page = elementOf(createPage().fixture);

    expect(page.querySelector('h1')?.textContent?.trim()).toBe('الإشعارات');
    expect(page.querySelector('app-page-header p')?.textContent?.trim()).toBe(
      'تابع آخر التحديثات و التنبيهات .',
    );
  });

  it('puts the tabs 40px under the heading and the feed 24px under the tabs, 18px apart', () => {
    const page = elementOf(createPage().fixture);

    expect(page.querySelector('app-notification-tabs')?.className).toContain('mt-10');
    const list = page.querySelector('ul') as HTMLElement;
    expect(list.className).toContain('mt-6');
    expect(list.className).toContain('gap-[18px]');
  });

  it('draws one card per notification, each with its link', () => {
    const page = elementOf(createPage().fixture);

    expect(page.querySelectorAll('ul > li app-notification-card')).toHaveLength(2);
    expect(
      Array.from(page.querySelectorAll('a[data-role="action"]'), (link) =>
        link.getAttribute('href'),
      ),
    ).toEqual(['/merchant/subscription', '/merchant/reviews']);
  });

  it('shows the unread count on its tab and filters when it is picked', () => {
    const { fixture } = createPage();
    const page = elementOf(fixture);
    const tabs = page.querySelectorAll('app-notification-tabs button');

    expect(tabs[2].textContent?.trim()).toBe('غير مقروءة (1)');
    (tabs[2] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(page.querySelectorAll('app-notification-card')).toHaveLength(1);
  });

  it('marks a notification read when its dot is pressed', () => {
    const { fixture, readIds } = createPage();

    (elementOf(fixture).querySelector('[data-role="unread-dot"]') as HTMLButtonElement).click();

    expect(readIds).toEqual(['a']);
  });

  it('writes the empty message when nothing has arrived', () => {
    const page = elementOf(createPage(() => of([])).fixture);

    expect(page.querySelector('app-empty-page-message')?.textContent).toContain(
      'لم تصلك أي إشعارات حتى الآن',
    );
  });

  it('offers a retry when the feed fails to load', () => {
    const page = elementOf(
      createPage(() => throwError(() => new Error('تعذر تحميل الإشعارات'))).fixture,
    );

    expect(page.querySelector('app-error-state')?.textContent).toContain('تعذر تحميل الإشعارات');
  });
});
