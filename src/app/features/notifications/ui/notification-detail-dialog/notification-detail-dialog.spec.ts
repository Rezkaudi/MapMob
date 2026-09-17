import { TestBed } from '@angular/core/testing';
import { AppNotification } from '../../models/notification';
import { buildNotificationDetailView } from '../../state/notification-detail-view';
import { buildNotification } from '../../testing/notification-fixture';
import { NotificationDetailDialog } from './notification-detail-dialog';

const NOW = new Date(2026, 8, 8, 10, 0);
const SCHEDULED = buildNotification();

function render(
  options: {
    notification?: AppNotification | null;
    isLoading?: boolean;
    error?: string | null;
  } = {},
) {
  const notification = options.notification === undefined ? SCHEDULED : options.notification;
  const fixture = TestBed.createComponent(NotificationDetailDialog);
  fixture.componentRef.setInput('notification', notification);
  fixture.componentRef.setInput(
    'view',
    notification ? buildNotificationDetailView(notification, NOW) : null,
  );
  fixture.componentRef.setInput('isLoading', options.isLoading ?? false);
  fixture.componentRef.setInput('error', options.error ?? null);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('NotificationDetailDialog', () => {
  it('shows the title, the status, the kind, the audience, the send time and the content', () => {
    const { element } = render();

    expect(element.textContent).toContain('تفاصيل الإشعار');
    expect(element.textContent).toContain('معاينة الإشعار ومعلومات الجدولة والاستهداف');
    expect(element.textContent).toContain('عروض جديدة بالقرب منك');
    expect(element.querySelector('app-notification-status-pill')?.textContent?.trim()).toBe(
      'مجدول',
    );
    expect(element.textContent).toContain('إشعار عام');
    expect(element.textContent).toContain('جميع المستخدمين');
    expect(element.textContent).toContain('1,250 مستخدم');
    expect(element.textContent).toContain('10 سبتمبر 2026- 10:00 صباحاً');
    expect(element.textContent).toContain('متبقي يومين');
    expect(element.textContent).toContain('محتوى الإشعار');
    expect(element.textContent).toContain('اكتشف أحدث العروض');
  });

  it('reports the primary action for the status, and the delete', () => {
    const { fixture, element } = render({
      notification: buildNotification({ status: 'sent', sendAt: '2026-09-01T10:00' }),
    });
    const primaryAction = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.primaryAction.subscribe(primaryAction);
    fixture.componentInstance.remove.subscribe(remove);

    expect(
      Array.from(element.querySelectorAll('footer button'), (b) => b.textContent?.trim()),
    ).toEqual(['حذف الإشعار', 'إعادة إرسال الإشعار']);
    buttonNamed(element, 'إعادة إرسال الإشعار').click();
    buttonNamed(element, 'حذف الإشعار').click();

    expect(primaryAction).toHaveBeenCalledWith('resend');
    expect(remove).toHaveBeenCalledOnce();
  });

  it('shows the error with a retry, and skeletons while loading', () => {
    const failed = render({ notification: null, error: 'تعذر تحميل الإشعار' });
    const retry = vi.fn();
    failed.fixture.componentInstance.retry.subscribe(retry);
    expect(failed.element.textContent).toContain('تعذر تحميل الإشعار');
    (failed.element.querySelector('app-error-state button') as HTMLButtonElement).click();
    expect(retry).toHaveBeenCalledOnce();

    const loading = render({ notification: null, isLoading: true });
    expect(loading.element.querySelector('app-skeleton')).toBeTruthy();
    expect(loading.element.querySelector('footer button')).toBeNull();
  });
});
