import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildNotificationDraft } from '../testing/notification-fixture';
import { NotificationHttpRepository } from './notification-http.repository';

const BASE_URL = 'https://api.test';

describe('NotificationHttpRepository', () => {
  let repository: NotificationHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(NotificationHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for a page of notifications', () => {
    repository.getNotifications({ pageIndex: 0, pageSize: 4, status: 'sent' }).subscribe();

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/notifications`);
    expect(request.request.params.get('status')).toBe('sent');
    request.flush({ items: [], totalCount: 0 });
  });

  it('asks for the summary and for one notification', () => {
    repository.getSummary().subscribe();
    repository.getNotification('n1').subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/notifications/summary` }).flush({});
    http.expectOne({ method: 'GET', url: `${BASE_URL}/notifications/n1` }).flush({});
  });

  it('deletes and copies a notification', () => {
    repository.deleteNotification('n1').subscribe();
    repository.duplicateNotification('n1').subscribe();

    http.expectOne({ method: 'DELETE', url: `${BASE_URL}/notifications/n1` }).flush(null);
    http.expectOne({ method: 'POST', url: `${BASE_URL}/notifications/n1/duplicate` }).flush({});
  });

  it('reschedules and resends with the new send time', () => {
    repository.rescheduleNotification('n1', '2026-09-18T16:30').subscribe();
    repository.resendNotification('n1', null).subscribe();

    const reschedule = http.expectOne({
      method: 'POST',
      url: `${BASE_URL}/notifications/n1/reschedule`,
    });
    expect(reschedule.request.body).toEqual({ sendAt: '2026-09-18T16:30' });
    reschedule.flush({});
    const resend = http.expectOne({ method: 'POST', url: `${BASE_URL}/notifications/n1/resend` });
    expect(resend.request.body).toEqual({ sendAt: null });
    resend.flush({});
  });

  it('loads the form options, searches recipients and asks for the audience estimate', () => {
    repository.getFormOptions().subscribe();
    repository.searchRecipients('users', 'سارة').subscribe();
    repository
      .estimateAudience({ audience: 'users', governorateId: 'g1', areaId: null })
      .subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/notifications/form-options` }).flush({});
    const search = http.expectOne(
      (candidate) => candidate.url === `${BASE_URL}/notifications/recipients`,
    );
    expect(search.request.params.get('audience')).toBe('users');
    expect(search.request.params.get('search')).toBe('سارة');
    search.flush([]);
    const estimate = http.expectOne(
      (candidate) => candidate.url === `${BASE_URL}/notifications/audience-estimate`,
    );
    expect(estimate.request.params.get('governorateId')).toBe('g1');
    expect(estimate.request.params.has('areaId')).toBe(false);
    estimate.flush({});
  });

  it('creates and updates a notification as form data, with the picture when there is one', () => {
    const image = new File(['x'], 'offer.png', { type: 'image/png' });
    repository
      .createNotification(buildNotificationDraft({ image, recipientIds: ['r1', 'r2'] }))
      .subscribe();
    repository
      .updateNotification('n1', buildNotificationDraft({ isImageRemoved: true }))
      .subscribe();

    const create = http.expectOne({ method: 'POST', url: `${BASE_URL}/notifications` });
    const createBody = create.request.body as FormData;
    expect(createBody.get('title')).toBe('عروض جديدة بانتظارك');
    expect(createBody.getAll('recipientIds')).toEqual(['r1', 'r2']);
    expect(createBody.get('image')).toBe(image);
    expect(createBody.has('sendAt')).toBe(false);
    create.flush({});
    const update = http.expectOne({ method: 'PUT', url: `${BASE_URL}/notifications/n1` });
    expect((update.request.body as FormData).get('isImageRemoved')).toBe('true');
    update.flush({});
  });
});
