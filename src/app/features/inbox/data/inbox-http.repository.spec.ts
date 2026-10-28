import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { InboxHttpRepository } from './inbox-http.repository';
import { LiveInboxNotification } from './live-inbox-notification';

const BASE = 'https://api.test';
const INBOX_URL = `${BASE}/admin/inbox`;
const ROW: LiveInboxNotification = {
  id: 3,
  type: 'complaint',
  title: 'بلاغ',
  body: 'نص',
  read_at: null,
  created_at: '2026-10-28T08:00:00Z',
};

function onePage(data: readonly LiveInboxNotification[]) {
  return { data, meta: { current_page: 1, last_page: 1 } };
}

describe('InboxHttpRepository', () => {
  let repository: InboxHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE },
        InboxHttpRepository,
      ],
    });
    repository = TestBed.inject(InboxHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads every page of the admin inbox', async () => {
    const list = firstValueFrom(repository.getNotifications());
    const request = http.expectOne((call) => call.url === INBOX_URL);
    expect(request.request.params.get('per_page')).toBe('100');
    request.flush(onePage([ROW]));
    expect((await list).map((card) => card.id)).toEqual(['3']);
  });

  it('marks one read and returns the saved row', async () => {
    const read = firstValueFrom(repository.markAsRead('3'));
    const patch = http.expectOne(`${INBOX_URL}/3/read`);
    expect(patch.request.method).toBe('PATCH');
    patch.flush({ data: { ...ROW, read_at: '2026-10-28T09:00:00Z' } });
    expect((await read).isRead).toBe(true);
  });

  it('reads the list again when the server answers without the row', async () => {
    const read = firstValueFrom(repository.markAsRead('3'));
    http.expectOne(`${INBOX_URL}/3/read`).flush({ data: null });
    http
      .expectOne((call) => call.url === INBOX_URL)
      .flush(onePage([{ ...ROW, read_at: '2026-10-28T09:00:00Z' }]));
    expect((await read).isRead).toBe(true);
  });
});
