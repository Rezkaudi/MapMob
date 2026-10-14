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
    http.expectOne(REPORTS_URL).flush({ data: [LIVE_REPORT, NEW_REPORT] });
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

  it('says the server cannot delete reports', () => {
    expect(repository.canDeleteComplaints).toBe(false);
  });

  it('reads every report once and filters and pages them on this side', async () => {
    const response = firstValueFrom(
      repository.getComplaints({ pageIndex: 0, pageSize: 4, status: 'new' }),
    );
    answerList();

    const page = await response;
    expect(page.totalCount).toBe(1);
    expect(page.items[0].id).toBe('12');
  });

  it('searches by the place name', async () => {
    const response = firstValueFrom(
      repository.getComplaints({ pageIndex: 0, pageSize: 4, search: 'الأمل' }),
    );
    answerList();

    expect((await response).items.map((complaint) => complaint.id)).toEqual(['11']);
  });

  it('counts the summary from the list', async () => {
    const response = firstValueFrom(repository.getSummary());
    answerList();

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

  it('builds the export file on this side', async () => {
    const response = firstValueFrom(repository.exportComplaints({ pageIndex: 0, pageSize: 4 }));
    answerList();

    expect((await response).type).toContain('text/csv');
  });
});
