import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { NotificationDraft } from '../models/notification-draft';
import { LiveNotification } from './live-notification';
import { NotificationHttpRepository } from './notification-http.repository';

const ADMIN_URL = 'https://api.test/admin';
const NOTIFICATIONS_URL = `${ADMIN_URL}/notifications`;

function live(overrides: Partial<LiveNotification> = {}): LiveNotification {
  return {
    id: 'n5',
    title: 'تحديث جديد',
    body: 'نسخة جديدة',
    audience: 'users',
    recipientMode: 'all',
    kind: 'general',
    status: 'sent',
    sendAt: null,
    sentAt: null,
    recipientCount: 0,
    imageUrl: null,
    governorateId: null,
    areaId: null,
    recipientIds: [],
    ...overrides,
  };
}

const DRAFT: NotificationDraft = {
  title: 'تحديث جديد',
  body: 'نسخة جديدة',
  audience: 'users',
  recipientMode: 'all',
  governorateId: null,
  areaId: null,
  recipientIds: [],
  sendAt: null,
  image: null,
  isImageRemoved: false,
};

describe('NotificationHttpRepository', () => {
  let repository: NotificationHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
    repository = TestBed.inject(NotificationHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends every picked filter in the list request', () => {
    repository
      .getNotifications({
        pageIndex: 0,
        pageSize: 4,
        search: 'عرض',
        sort: 'newest',
        audience: 'companies',
        kind: 'private',
        status: 'sent',
        sentFrom: '2026-11-01',
        sentTo: '2026-11-08',
      })
      .subscribe();

    const request = http.expectOne((call) => call.url === NOTIFICATIONS_URL);
    const params = request.request.params;
    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['search', 'عرض'],
      ['sort_by', 'latest'],
      ['audience', 'companies'],
      ['kind', 'private'],
      ['status', 'sent'],
      ['date_from', '2026-11-01'],
      ['date_to', '2026-11-08'],
      ['page', '1'],
      ['per_page', '4'],
    ]);
    request.flush({ items: [], totalCount: 0 });
  });

  it('shows the server page as it comes, without filtering it here', async () => {
    const response = firstValueFrom(
      repository.getNotifications({ pageIndex: 0, pageSize: 4, status: 'scheduled' }),
    );

    http
      .expectOne((call) => call.url === NOTIFICATIONS_URL)
      .flush({
        items: [
          live(),
          live({ id: 'n6', status: 'scheduled', sendAt: '2030-01-01T10:00:00+00:00' }),
        ],
        totalCount: 8,
      });

    const page = await response;
    expect(page.totalCount).toBe(8);
    expect(page.items.map((notification) => notification.id)).toEqual(['n5', 'n6']);
  });

  it('reads the four counts', async () => {
    const response = firstValueFrom(repository.getSummary());

    http
      .expectOne(`${NOTIFICATIONS_URL}/summary`)
      .flush({ totalCount: 3, sentCount: 2, scheduledCount: 0, draftCount: 1 });

    expect((await response).sentCount).toBe(2);
  });

  it('reads one notification by the number in its id', async () => {
    const response = firstValueFrom(repository.getNotification('n5'));

    http.expectOne(`${NOTIFICATIONS_URL}/5`).flush({ data: live({ areaId: '7' }) });

    expect((await response).areaId).toBe('7');
  });

  it('adds a notification as multipart', async () => {
    const response = firstValueFrom(repository.createNotification(DRAFT));

    const request = http.expectOne(NOTIFICATIONS_URL);
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('intent')).toBe('publish');
    request.flush({ data: live() });

    expect((await response).id).toBe('n5');
  });

  it('saves a notification with PUT inside the POST', async () => {
    const response = firstValueFrom(repository.updateNotification('n5', DRAFT));

    const request = http.expectOne(`${NOTIFICATIONS_URL}/5`);
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('_method')).toBe('PUT');
    request.flush({ data: live() });

    expect((await response).title).toBe('تحديث جديد');
  });

  it('deletes and moves a notification by its number', async () => {
    const deleted = firstValueFrom(repository.deleteNotification('n5'), {
      defaultValue: undefined,
    });
    const removal = http.expectOne(`${NOTIFICATIONS_URL}/5`);
    expect(removal.request.method).toBe('DELETE');
    removal.flush({ status: true });
    await deleted;

    const moved = firstValueFrom(repository.rescheduleNotification('n5', '2030-01-01T10:00'));
    const move = http.expectOne(`${NOTIFICATIONS_URL}/5/reschedule`);
    expect(move.request.body).toEqual({ sendAt: '2030-01-01T10:00' });
    move.flush({ sendAt: '2030-01-01T10:00:00+00:00' });
    http
      .expectOne(`${NOTIFICATIONS_URL}/5`)
      .flush({ data: live({ status: 'scheduled', sendAt: '2030-01-01T10:00:00+00:00' }) });
    expect((await moved).status).toBe('scheduled');
  });

  it('sends again at once through the resend route', async () => {
    const response = firstValueFrom(repository.resendNotification('n5', null));

    http.expectOne(`${NOTIFICATIONS_URL}/5/resend`).flush({ sendAt: null });
    http.expectOne(`${NOTIFICATIONS_URL}/5`).flush({ data: live({ status: 'sent' }) });

    expect((await response).status).toBe('sent');
  });

  it('sends again later by scheduling a copy, as resend always sends at once', async () => {
    const response = firstValueFrom(repository.resendNotification('n5', '2030-01-01T10:00'));

    http.expectOne(`${NOTIFICATIONS_URL}/5/duplicate`).flush({ data: live({ id: 'n9' }) });
    http.expectOne(`${NOTIFICATIONS_URL}/9/reschedule`).flush({ sendAt: '2030-01-01T10:00' });
    http.expectOne(`${NOTIFICATIONS_URL}/9`).flush({
      data: live({ id: 'n9', status: 'scheduled', sendAt: '2030-01-01T10:00:00+00:00' }),
    });

    expect((await response).id).toBe('n9');
  });

  it('reads the governorates of the form', async () => {
    const response = firstValueFrom(repository.getFormOptions());

    http.expectOne(`${NOTIFICATIONS_URL}/formoptions`).flush({ governorates: [] });

    expect(await response).toEqual({ governorates: [] });
  });

  it('lets the server search the users and shows what it finds', async () => {
    const response = firstValueFrom(repository.searchRecipients('users', 'moh'));

    http
      .expectOne((candidate) => candidate.url === `${NOTIFICATIONS_URL}/recipients`)
      .flush([
        { id: '1', name: 'map mop', phone: null, city: 'دمشق' },
        { id: '11', name: 'mohamad', phone: '963956336101', city: 'دمشق' },
      ]);

    expect(await response).toEqual([
      { id: '1', name: 'map mop', phone: '', city: 'دمشق' },
      { id: '11', name: 'mohamad', phone: '963956336101', city: 'دمشق' },
    ]);
  });

  it('offers the places for companies, as the recipients route only lists users', async () => {
    const response = firstValueFrom(repository.searchRecipients('companies', 'happy'));

    const request = http.expectOne((candidate) => candidate.url === `${ADMIN_URL}/stores`);
    expect(request.request.params.get('search')).toBe('happy');
    expect(request.request.params.has('per_page')).toBe(false);
    request.flush({
      items: [{ id: '4', name: 'happy store', governorate: { id: '1', name: 'دمشق' } }],
      totalCount: 1,
    });

    expect(await response).toEqual([{ id: '4', name: 'happy store', phone: '', city: 'دمشق' }]);
  });

  it('asks how many devices a place would reach', async () => {
    const response = firstValueFrom(
      repository.estimateAudience({ audience: 'users', governorateId: '1', areaId: null }),
    );

    const request = http.expectOne(
      (candidate) => candidate.url === `${NOTIFICATIONS_URL}/audience-estimate`,
    );
    expect(request.request.params.get('governorateId')).toBe('1');
    expect(request.request.params.has('areaId')).toBe(false);
    request.flush({ deviceCount: 10, sharePercent: 5 });

    expect((await response).deviceCount).toBe(10);
  });
});
