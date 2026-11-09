import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LIVE_REPORT, LIVE_REPORTED_STORE } from '../testing/live-report-fixture';
import { ComplaintHttpRepository } from './complaint-http.repository';

const BASE_URL = 'https://api.test';
const REPORTS_URL = `${BASE_URL}/admin/reports`;
const NEW_REPORT = { ...LIVE_REPORT, id: 12, status: 'new', store: { id: 1, name: 'متجر دمشق' } };

describe('ComplaintHttpRepository', () => {
  let repository: ComplaintHttpRepository;
  let http: HttpTestingController;

  function answerList(): void {
    http
      .expectOne((candidate) => candidate.url === REPORTS_URL)
      .flush({ data: [LIVE_REPORT, NEW_REPORT] });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComplaintHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(ComplaintHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lets the admin delete reports', () => {
    expect(repository.canDeleteComplaints).toBe(true);
  });

  it('deletes one report by its id', async () => {
    const response = firstValueFrom(repository.deleteComplaint('11'), { defaultValue: undefined });

    const request = http.expectOne(`${REPORTS_URL}/11`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ status_code: 200 });
    await response;
  });

  it('shows the server page as it comes, without filtering it here', async () => {
    const response = firstValueFrom(
      repository.getComplaints({ pageIndex: 0, pageSize: 4, status: 'new' }),
    );
    answerList();

    expect((await response).items.map((complaint) => complaint.id)).toEqual(['11', '12']);
  });

  it('reads the total from meta when the server sends it', async () => {
    const response = firstValueFrom(repository.getComplaints({ pageIndex: 0, pageSize: 4 }));
    http
      .expectOne((candidate) => candidate.url === REPORTS_URL)
      .flush({ data: [LIVE_REPORT], meta: { total: 9 } });

    expect((await response).totalCount).toBe(9);
  });

  it('opens one more page when a page without meta comes back full', async () => {
    const response = firstValueFrom(repository.getComplaints({ pageIndex: 1, pageSize: 2 }));
    answerList();

    expect((await response).totalCount).toBe(5);
  });

  it('ends the list at a page without meta that is not full', async () => {
    const response = firstValueFrom(repository.getComplaints({ pageIndex: 1, pageSize: 4 }));
    answerList();

    expect((await response).totalCount).toBe(6);
  });

  it('sends every picked filter in the list request', () => {
    repository
      .getComplaints({
        pageIndex: 0,
        pageSize: 4,
        search: 'الأمل',
        sort: 'newest',
        status: 'inReview',
        reportedFrom: '2026-11-01',
        reportedTo: '2026-11-08',
      })
      .subscribe();

    const request = http.expectOne((candidate) => candidate.url === REPORTS_URL);
    expect(
      request.request.params.keys().map((key) => [key, request.request.params.get(key)]),
    ).toEqual([
      ['search', 'الأمل'],
      ['sort_by', 'latest'],
      ['status', 'under_review'],
      ['date_from', '2026-11-01'],
      ['date_to', '2026-11-08'],
      ['page', '1'],
      ['per_page', '4'],
    ]);
    request.flush({ data: [] });
  });

  it('reads the five counts from the summary route', async () => {
    const response = firstValueFrom(repository.getSummary());
    http.expectOne(`${REPORTS_URL}/summary`).flush({
      status_code: 200,
      data: { totalCount: 2, newCount: 1, inReviewCount: 1, resolvedCount: 0, rejectedCount: 0 },
    });

    expect(await response).toEqual({
      totalCount: 2,
      newCount: 1,
      inReviewCount: 1,
      resolvedCount: 0,
      rejectedCount: 0,
    });
  });

  it('reads one report with its store for the place card', async () => {
    const response = firstValueFrom(repository.getComplaint('11'));

    http.expectOne(`${REPORTS_URL}/11`).flush({ data: LIVE_REPORT });
    http.expectOne(`${BASE_URL}/admin/stores/18`).flush({ data: LIVE_REPORTED_STORE });

    const detail = await response;
    expect(detail.place.categoryName).toBe('صيدلية');
  });

  it('still opens the report when its store cannot be read', async () => {
    const response = firstValueFrom(repository.getComplaint('11'));

    http.expectOne(`${REPORTS_URL}/11`).flush({ data: LIVE_REPORT });
    http
      .expectOne(`${BASE_URL}/admin/stores/18`)
      .flush({ message: 'not found' }, { status: 404, statusText: 'Not Found' });

    expect((await response).place.name).toBe('صيدلية الأمل');
  });

  it('saves the review with PUT inside a POST and the server words', async () => {
    const response = firstValueFrom(
      repository.saveReview('11', { status: 'inReview', adminNotes: 'نتابع' }),
    );

    const request = http.expectOne({ method: 'POST', url: `${REPORTS_URL}/11` });
    expect(request.request.body).toEqual({
      _method: 'PUT',
      status: 'under_review',
      admin_notes: 'نتابع',
    });
    request.flush({ data: { ...LIVE_REPORT, admin_notes: 'نتابع' } });
    http.expectOne(`${BASE_URL}/admin/stores/18`).flush({ data: LIVE_REPORTED_STORE });

    expect((await response).adminNotes).toBe('نتابع');
  });

  it('downloads the export file from the server, with the table filters', async () => {
    const file = new Blob(['ID'], { type: 'text/csv' });
    const response = firstValueFrom(
      repository.exportComplaints({ pageIndex: 0, pageSize: 4, status: 'inReview', reportedFrom: '2026-11-01' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${REPORTS_URL}/export`);
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('status')).toBe('under_review');
    expect(request.request.params.get('date_from')).toBe('2026-11-01');
    expect(request.request.params.has('per_page')).toBe(false);
    request.flush(file);

    expect(await response).toBe(file);
  });
});
