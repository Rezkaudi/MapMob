import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { NotificationRepository } from '../../data/notification.repository';
import { buildNotification, buildNotificationDetail } from '../../testing/notification-fixture';
import { NotificationList } from './notification-list';

const SUMMARY = { totalCount: 248, sentCount: 150, scheduledCount: 10, draftCount: 20 };

function createPage(overrides: Partial<NotificationRepository> = {}) {
  const deletedIds: string[] = [];
  const copiedIds: string[] = [];
  const timeWrites: string[] = [];
  const repository: Partial<NotificationRepository> = {
    getNotifications: () =>
      of({
        items: [
          buildNotification({ id: 'n1', title: 'عرض جديد', status: 'sent' }),
          buildNotification({ id: 'n2', title: 'عرض قديم', status: 'draft', sendAt: null }),
        ],
        totalCount: 3000,
      }),
    getSummary: () => of(SUMMARY),
    deleteNotification: (id): Observable<void> => {
      deletedIds.push(id);
      return of(undefined);
    },
    getNotification: (id) =>
      of(buildNotificationDetail({ id, title: 'عرض جديد', status: 'scheduled' })),
    rescheduleNotification: (id, sendAt) => {
      timeWrites.push(`reschedule ${id} ${sendAt}`);
      return of(buildNotification());
    },
    resendNotification: (id, sendAt) => {
      timeWrites.push(`resend ${id} ${sendAt}`);
      return of(buildNotification());
    },
    duplicateNotification: (id) => {
      copiedIds.push(id);
      return of(buildNotification());
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: NotificationRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date(2026, 8, 8) },
    ],
  });
  const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(NotificationList);
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    navigateByUrl,
    deletedIds,
    copiedIds,
    timeWrites,
  };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

function pickRowMenuItem(
  page: ReturnType<typeof createPage>,
  rowIndex: number,
  label: string,
): void {
  const row = page.element.querySelectorAll('app-notification-table tbody tr')[rowIndex];
  (row.querySelector('button[aria-haspopup]') as HTMLButtonElement).click();
  page.fixture.detectChanges();
  buttonNamed(page.element.querySelector('[data-testid="action-menu-panel"]')!, label).click();
  page.fixture.detectChanges();
}

describe('NotificationList', () => {
  it('shows the header, the stat cards, the toolbar, the table and the paging', () => {
    const { element } = createPage();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('الإشعارات');
    expect(element.textContent).toContain('إدارة و إنشاء إشعارات للمستخدمين والشركات');
    expect(element.querySelector('app-page-header app-add-button')?.textContent).toContain(
      'إنشاء إشعار جديد',
    );
    expect(element.querySelector('app-page-header app-export-button')).toBeNull();
    expect(
      Array.from(element.querySelectorAll('app-stat-card [data-role="value"]'), (value) =>
        value.textContent?.trim(),
      ),
    ).toEqual(['248', '150', '10', '20']);
    expect(element.querySelector('app-notification-toolbar')).toBeTruthy();
    expect(element.querySelectorAll('app-notification-table tbody tr')).toHaveLength(2);
    expect(element.textContent).toContain('من 3000 إشعار');
  });

  it('shows only the header and the empty message when there are no notifications', () => {
    const { element } = createPage({ getNotifications: () => of({ items: [], totalCount: 0 }) });

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('لا توجد إشعارات مضافة حتى الآن');
    expect(element.textContent).toContain('أرسل أول إشعار إلى المنصة.');
    expect(element.querySelector('app-notification-table')).toBeNull();
    expect(element.querySelector('app-page-header app-add-button')).toBeNull();
  });

  it('goes to the create page from the header button, and to the edit page from a row', () => {
    const page = createPage();

    buttonNamed(page.element.querySelector('app-page-header')!, 'إنشاء إشعار جديد').click();
    pickRowMenuItem(page, 0, 'تعديل');

    expect(page.navigateByUrl).toHaveBeenCalledWith('/notifications/new');
    expect(page.navigateByUrl).toHaveBeenCalledWith('/notifications/n1/edit');
  });

  it('copies a notification from its row menu', async () => {
    const page = createPage();

    pickRowMenuItem(page, 1, 'نسخ الإشعار');
    await page.fixture.whenStable();

    expect(page.copiedIds).toEqual(['n2']);
  });

  it('asks before deleting a notification, then deletes it', async () => {
    const page = createPage();

    pickRowMenuItem(page, 0, 'حذف');
    const dialog = page.element.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(dialog.textContent).toContain('هل أنت متأكد من حذف إشعار "عرض جديد"؟');
    expect(page.deletedIds).toEqual([]);

    buttonNamed(dialog, 'حذف الإشعار').click();
    await page.fixture.whenStable();
    page.fixture.detectChanges();

    expect(page.deletedIds).toEqual(['n1']);
    expect(page.element.querySelector('app-confirm-action-dialog')).toBeNull();
  });

  it('opens the details dialog from a row title, and closes it from the cross', () => {
    const page = createPage();

    (page.element.querySelector('[data-role="open-notification"]') as HTMLElement).click();
    page.fixture.detectChanges();
    const dialog = page.element.querySelector('app-notification-detail-dialog') as HTMLElement;
    expect(dialog.textContent).toContain('تفاصيل الإشعار');
    expect(dialog.textContent).toContain('عرض جديد');

    (dialog.querySelector('button[aria-label="إغلاق النافذة"]') as HTMLButtonElement).click();
    page.fixture.detectChanges();

    expect(page.element.querySelector('app-notification-detail-dialog')).toBeNull();
  });

  it("goes to the edit page from a draft's details", () => {
    const page = createPage({
      getNotification: (id) => of(buildNotificationDetail({ id, status: 'draft', sendAt: null })),
    });

    pickRowMenuItem(page, 1, 'عرض التفاصيل');
    buttonNamed(
      page.element.querySelector('app-notification-detail-dialog')!,
      'تعديل الإشعار',
    ).click();

    expect(page.navigateByUrl).toHaveBeenCalledWith('/notifications/n2/edit');
  });

  it('deletes from the details dialog and closes it', async () => {
    const page = createPage();
    pickRowMenuItem(page, 0, 'عرض التفاصيل');

    buttonNamed(
      page.element.querySelector('app-notification-detail-dialog')!,
      'حذف الإشعار',
    ).click();
    page.fixture.detectChanges();
    buttonNamed(page.element.querySelector('app-confirm-action-dialog')!, 'حذف الإشعار').click();
    await page.fixture.whenStable();
    page.fixture.detectChanges();

    expect(page.deletedIds).toEqual(['n1']);
    expect(page.element.querySelector('app-notification-detail-dialog')).toBeNull();
  });

  it('reschedules a scheduled notification from its details, and can go back to them', async () => {
    const page = createPage();
    pickRowMenuItem(page, 0, 'عرض التفاصيل');

    buttonNamed(
      page.element.querySelector('app-notification-detail-dialog')!,
      'إعادة جدولة',
    ).click();
    page.fixture.detectChanges();
    const reschedule = page.element.querySelector(
      'app-notification-reschedule-dialog',
    ) as HTMLElement;
    expect(reschedule).toBeTruthy();
    expect(page.element.querySelector('app-notification-detail-dialog')).toBeNull();

    (reschedule.querySelector('button[aria-label="رجوع"]') as HTMLButtonElement).click();
    page.fixture.detectChanges();
    expect(page.element.querySelector('app-notification-detail-dialog')).toBeTruthy();

    buttonNamed(
      page.element.querySelector('app-notification-detail-dialog')!,
      'إعادة جدولة',
    ).click();
    page.fixture.detectChanges();
    const dayInput = page.element.querySelector(
      'app-notification-reschedule-dialog input[type="date"]',
    ) as HTMLInputElement;
    dayInput.value = '2026-09-18';
    dayInput.dispatchEvent(new Event('change'));
    page.fixture.detectChanges();
    buttonNamed(
      page.element.querySelector('app-notification-reschedule-dialog')!,
      'تأكيد إعادة جدولة',
    ).click();
    await page.fixture.whenStable();
    page.fixture.detectChanges();

    expect(page.timeWrites).toEqual(['reschedule n1 2026-09-18T10:00']);
    expect(page.element.querySelector('app-notification-reschedule-dialog')).toBeNull();
  });

  it('resends a sent notification straight away from its details', async () => {
    const page = createPage({
      getNotification: (id) =>
        of(buildNotificationDetail({ id, status: 'sent', sendAt: '2026-09-01T10:00' })),
    });
    pickRowMenuItem(page, 0, 'عرض التفاصيل');

    buttonNamed(
      page.element.querySelector('app-notification-detail-dialog')!,
      'إعادة إرسال الإشعار',
    ).click();
    page.fixture.detectChanges();
    const resend = page.element.querySelector('app-notification-resend-dialog') as HTMLElement;
    Array.from(resend.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
      .find((radio) => radio.textContent?.includes('إرسال فوري الآن'))!
      .click();
    page.fixture.detectChanges();
    buttonNamed(resend.querySelector('footer')!, 'إعادة إرسال الإشعار').click();
    await page.fixture.whenStable();
    page.fixture.detectChanges();

    expect(page.timeWrites).toEqual(['resend n1 null']);
    expect(page.element.querySelector('app-notification-resend-dialog')).toBeNull();
  });
});
