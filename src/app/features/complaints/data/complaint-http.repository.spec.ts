import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { ComplaintHttpRepository } from './complaint-http.repository';

const BASE_URL = 'https://api.test';

describe('ComplaintHttpRepository', () => {
  let repository: ComplaintHttpRepository;
  let http: HttpTestingController;

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

  it('asks for a page of complaints', () => {
    repository.getComplaints({ pageIndex: 0, pageSize: 4, status: 'new' }).subscribe();

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/complaints`);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('status')).toBe('new');
    request.flush({ items: [], totalCount: 0 });
  });

  it('asks for the summary', () => {
    repository.getSummary().subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/complaints/summary` }).flush({});
  });

  it('asks for one complaint', () => {
    repository.getComplaint('complaint-1').subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/complaints/complaint-1` }).flush({});
  });

  it('saves the review with a patch', () => {
    repository
      .saveReview('complaint-1', { status: 'resolved', adminNotes: 'تم التحقق' })
      .subscribe();

    const request = http.expectOne({ method: 'PATCH', url: `${BASE_URL}/complaints/complaint-1` });
    expect(request.request.body).toEqual({ status: 'resolved', adminNotes: 'تم التحقق' });
    request.flush({});
  });

  it('deletes a complaint', () => {
    repository.deleteComplaint('complaint-1').subscribe();

    http.expectOne({ method: 'DELETE', url: `${BASE_URL}/complaints/complaint-1` }).flush(null);
  });

  it('asks for the export file with the same filters', () => {
    repository.exportComplaints({ pageIndex: 0, pageSize: 4, search: 'الشام' }).subscribe();

    const request = http.expectOne(
      (candidate) => candidate.url === `${BASE_URL}/complaints/export`,
    );
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('search')).toBe('الشام');
    request.flush(new Blob(['csv']));
  });
});
