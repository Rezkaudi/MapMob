import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NotificationAlertsRepository } from '../../data/notification-alerts.repository';
import { buildNotificationAlerts } from '../../testing/settings-fixture';
import { NotificationSettings } from './notification-settings';

function render(overrides: Partial<NotificationAlertsRepository> = {}) {
  const repository: Partial<NotificationAlertsRepository> = {
    getAlerts: () => of(buildNotificationAlerts()),
    setAlertEnabled: (kind, isEnabled) => of({ kind, isEnabled }),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [{ provide: NotificationAlertsRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(NotificationSettings);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('NotificationSettings', () => {
  it('lists the five dashboard alerts in the design order', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إعدادات الإشعارات');
    expect(element.textContent).toContain('حدد التنبيهات التي تريد استلامها كمشرف.');
    expect(element.querySelector('h3')?.textContent?.trim()).toBe('تنبيهات لوحة التحكم');
    expect(
      Array.from(element.querySelectorAll('[data-role="alert-title"]')).map((title) =>
        title.textContent?.trim(),
      ),
    ).toEqual([
      'بلاغ جديد عن متجر أو محتوى',
      'متجر أو شركة جديدة بانتظار الاعتماد',
      'تقييم تم الإبلاغ عنه كمخالف',
      'اشتراك تجاري على وشك الانتهاء',
      'عملية دفع جديدة',
    ]);
  });

  it('warns when a switch could not be saved', async () => {
    const { fixture, element } = render({
      setAlertEnabled: () => throwError(() => new Error('الخادم لا يستجيب')),
    });

    (element.querySelector('button[role="switch"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('app-toast')?.textContent).toContain('تعذر حفظ التنبيه');
    expect(element.querySelector('button[role="switch"]')?.getAttribute('aria-checked')).toBe(
      'true',
    );
  });
});
