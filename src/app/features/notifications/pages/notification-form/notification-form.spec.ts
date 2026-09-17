import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { NotificationRepository } from '../../data/notification.repository';
import { NotificationDraft } from '../../models/notification-draft';
import { buildNotification, buildNotificationDetail } from '../../testing/notification-fixture';
import { NotificationForm } from './notification-form';

const OPTIONS = {
  governorates: [{ id: 'g1', name: 'طرطوس', areas: [{ id: 'a1', name: 'صافيتا' }] }],
};
const RECIPIENT = { id: 'r1', name: 'سارة أحمد التميمي', phone: '0501234567', city: 'طرطوس' };

async function createPage(editingId?: string) {
  const saved: { id: string | null; draft: NotificationDraft }[] = [];
  const searches: string[] = [];
  const repository: Partial<NotificationRepository> = {
    getFormOptions: () => of(OPTIONS),
    getNotification: (id) =>
      of(
        buildNotificationDetail({
          id,
          title: 'عروض الصيف',
          recipientMode: 'location',
          governorateId: 'g1',
          sendAt: '2026-09-20T08:00',
        }),
      ),
    searchRecipients: (audience, search) => {
      searches.push(`${audience}:${search}`);
      return of([RECIPIENT]);
    },
    estimateAudience: () => of({ deviceCount: 16840, sharePercent: 68.5 }),
    createNotification: (draft) => {
      saved.push({ id: null, draft });
      return of(buildNotification());
    },
    updateNotification: (id, draft) => {
      saved.push({ id, draft });
      return of(buildNotification());
    },
  };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: NotificationRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date(2026, 8, 8, 10, 0) },
    ],
  });
  const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(NotificationForm);
  if (editingId) {
    fixture.componentRef.setInput('id', editingId);
  }
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, saved, searches, navigateByUrl };
}

type Page = Awaited<ReturnType<typeof createPage>>;

function type(page: Page, selector: string, value: string): void {
  const field = page.element.querySelector(selector) as HTMLInputElement;
  field.value = value;
  field.dispatchEvent(new Event('input'));
  page.fixture.detectChanges();
}

function pickCard(page: Page, groupName: string, title: string): void {
  Array.from(
    page.element.querySelectorAll<HTMLElement>(`[aria-label="${groupName}"] [role="radio"]`),
  )
    .find((card) => card.textContent?.includes(title))!
    .click();
  page.fixture.detectChanges();
}

function buttonNamed(page: Page, label: string): HTMLButtonElement {
  return Array.from(page.element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

async function settle(page: Page): Promise<void> {
  await page.fixture.whenStable();
  page.fixture.detectChanges();
}

describe('NotificationForm', () => {
  it('shows the heading, the three cards and the action bar', async () => {
    const { element } = await createPage();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('إنشاء إشعار جديد');
    expect(element.textContent).toContain('قم بصياغة محتوى الإشعار واختيار الفئة المستهدفة.');
    expect(element.querySelector('nav a')?.textContent?.trim()).toBe('الإشعارات');
    expect(
      Array.from(element.querySelectorAll('app-form-card h2'), (h) => h.textContent?.trim()),
    ).toEqual(['محتوى الإشعار و الرسالة', 'الفئة المستهدفة', 'موعد الإرسال وخطة الجدولة']);
    expect(element.textContent).toContain('صورة الإشعار (اختياري)');
    expect(element.querySelector('app-form-action-bar')?.textContent).toContain('حفظ الإشعار');
  });

  it('counts the characters of the title and the body as they are typed', async () => {
    const page = await createPage();
    expect(page.element.textContent).toContain('60/0');
    expect(page.element.textContent).toContain('120/0');

    type(page, '#notification-title', 'عروض');

    expect(page.element.textContent).toContain('60/4');
  });

  it('shows the place panel with the estimate, or the recipient list, for the picked mode', async () => {
    const page = await createPage();
    expect(page.element.querySelector('app-notification-location-criteria')).toBeNull();

    pickCard(page, 'تحديد المستلمين', 'مخصص حسب الموقع');
    const governorate = page.element.querySelector(
      'select[aria-label="المحافظة"]',
    ) as HTMLSelectElement;
    governorate.value = 'g1';
    governorate.dispatchEvent(new Event('change'));
    await settle(page);
    expect(page.element.textContent).toContain('الجمهور المقدر: 16,840 جهاز نشط');

    pickCard(page, 'تحديد المستلمين', 'مستخدمين محددين');
    await settle(page);
    expect(page.element.querySelector('app-notification-location-criteria')).toBeNull();
    expect(page.element.textContent).toContain('سارة أحمد التميمي');
    expect(page.searches).toContain('users:');
  });

  it('shows what is missing instead of saving an empty form', async () => {
    const page = await createPage();

    buttonNamed(page, 'حفظ الإشعار').click();
    await settle(page);

    expect(page.saved).toEqual([]);
    expect(page.element.textContent).toContain('اكتب عنوان الإشعار');
    expect(page.element.textContent).toContain('اكتب نص الإشعار التفصيلي');
  });

  it('saves a new notification to send now, then goes back to the list', async () => {
    const page = await createPage();
    type(page, '#notification-title', 'عروض جديدة بانتظارك');
    type(page, '#notification-body', 'اكتشف أحدث العروض.');

    buttonNamed(page, 'حفظ الإشعار').click();
    await settle(page);

    expect(page.saved).toHaveLength(1);
    expect(page.saved[0].id).toBeNull();
    expect(page.saved[0].draft).toMatchObject({
      title: 'عروض جديدة بانتظارك',
      recipientMode: 'all',
      sendAt: null,
      intent: 'publish',
    });
    expect(page.navigateByUrl).toHaveBeenCalledWith('/notifications');
  });

  it('opens a notification for editing filled in, and saves it as a draft', async () => {
    const page = await createPage('n9');

    expect(page.element.querySelector('h1')?.textContent?.trim()).toBe('تعديل الإشعار');
    expect((page.element.querySelector('#notification-title') as HTMLInputElement).value).toBe(
      'عروض الصيف',
    );
    expect(page.element.querySelector('app-notification-location-criteria')).toBeTruthy();

    buttonNamed(page, 'حفظ كمسودة').click();
    await settle(page);

    expect(page.saved[0].id).toBe('n9');
    expect(page.saved[0].draft).toMatchObject({
      governorateId: 'g1',
      sendAt: '2026-09-20T08:00',
      intent: 'draft',
    });
  });
});
