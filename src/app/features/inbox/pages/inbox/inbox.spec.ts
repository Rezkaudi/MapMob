import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { InboxRepository } from '../../data/inbox.repository';
import { InboxNotification } from '../../models/inbox-notification';
import { buildInboxNotification } from '../../testing/inbox-fixture';
import { InboxPage } from './inbox';

const NOW = new Date('2026-09-20T10:00:00.000Z');
const UNREAD = buildInboxNotification({ id: 'a', isRead: false });
const READ = buildInboxNotification({
  id: 'b',
  category: 'subscriptions',
  title: 'طلب ترقية باقة',
  isRead: true,
});

function createPage(overrides: Partial<InboxRepository> = {}): {
  fixture: ComponentFixture<InboxPage>;
  readIds: string[];
} {
  const readIds: string[] = [];
  const repository: Partial<InboxRepository> = {
    getNotifications: () => of([UNREAD, READ]) as Observable<readonly InboxNotification[]>,
    markAsRead: (id) => {
      readIds.push(id);
      return of({ ...UNREAD, id, isRead: true });
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: InboxRepository, useValue: repository },
      { provide: CLOCK, useValue: () => NOW },
    ],
  });
  const fixture = TestBed.createComponent(InboxPage);
  fixture.detectChanges();
  return { fixture, readIds };
}

function elementOf(fixture: ComponentFixture<InboxPage>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

describe('InboxPage', () => {
  it('heads the page the way the design words it', () => {
    const page = elementOf(createPage().fixture);

    expect(page.querySelector('h1')?.textContent?.trim()).toBe('الإشعارات الواردة');
    expect(page.querySelector('app-page-header p')?.textContent?.trim()).toBe(
      'جميع الإشعارات والتنبيهات التي تتطلب انتباهك .',
    );
  });

  it('draws one card per notification, in a list', () => {
    const page = elementOf(createPage().fixture);

    expect(page.querySelectorAll('ul > li app-inbox-notification-card').length).toBe(2);
  });

  it('shows the unread count on the tab and filters when it is picked', () => {
    const { fixture } = createPage();
    const page = elementOf(fixture);
    const unreadTab = [...page.querySelectorAll('button[role="tab"]')][2] as HTMLButtonElement;

    expect(unreadTab.textContent?.trim()).toBe('غير مقروءة (1)');

    unreadTab.click();
    fixture.detectChanges();

    expect(page.querySelectorAll('app-inbox-notification-card').length).toBe(1);
  });

  it('marks a notification read when its dot is pressed', () => {
    const { fixture, readIds } = createPage();
    const dot = elementOf(fixture).querySelector('[data-role="unread-dot"]') as HTMLButtonElement;

    dot.click();
    fixture.detectChanges();

    expect(readIds).toEqual(['a']);
    expect(elementOf(fixture).querySelector('[data-role="unread-dot"]')).toBeNull();
  });

  it('writes the empty message when nothing has arrived', () => {
    const page = elementOf(createPage({ getNotifications: () => of([]) }).fixture);

    expect(page.querySelector('app-empty-page-message h2')?.textContent?.trim()).toBe(
      'لم تصلك أي إشعارات حتى الآن',
    );
    expect(page.querySelector('app-empty-page-message p')?.textContent?.trim()).toBe(
      'لا توجد إشعارات جديدة حاليًا. ستظهر هنا التنبيهات والتحديثات التي تحتاج إلى انتباهك.',
    );
  });

  it('lifts the empty message by half the top bar, the way the frame centres it', () => {
    const page = elementOf(createPage({ getNotifications: () => of([]) }).fixture);

    expect(page.querySelector('app-empty-page-message')?.classList.contains('bottom-16')).toBe(
      true,
    );
  });

  it('keeps the tabs above the empty message', () => {
    const page = elementOf(createPage({ getNotifications: () => of([]) }).fixture);

    expect(page.querySelector('app-inbox-tabs')).not.toBeNull();
  });

  it('offers a retry when the inbox fails to load', () => {
    const page = elementOf(
      createPage({ getNotifications: () => throwError(() => new Error('تعذر التحميل')) }).fixture,
    );

    expect(page.querySelector('app-error-state')?.textContent).toContain('تعذر التحميل');
  });
});
