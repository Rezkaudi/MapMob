import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PaymentHttpRepository } from './payment-http.repository';

const BASE_URL = 'https://api.test';

describe('PaymentHttpRepository', () => {
  let repository: PaymentHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(PaymentHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for a page of payments', () => {
    repository.getPayments({ pageIndex: 0, pageSize: 4, search: 'الحياة' }).subscribe();

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/payments`);
    expect(request.request.params.get('search')).toBe('الحياة');
    request.flush({ items: [], totalCount: 0 });
  });

  it('asks for the summary', () => {
    repository.getSummary().subscribe();

    http
      .expectOne({ method: 'GET', url: `${BASE_URL}/payments/summary` })
      .flush({ pendingCount: 0, transactionCount: 0, monthTotal: 0, cumulativeTotal: 0 });
  });

  it('asks for one payment detail', () => {
    repository.getPaymentDetail('payment-1').subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/payments/payment-1` }).flush({});
  });

  it('asks for the export file', () => {
    repository.exportPayments({ pageIndex: 0, pageSize: 4 }).subscribe();

    const request = http.expectOne(
      (candidate) => candidate.url === `${BASE_URL}/payments/export`,
    );
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob());
  });
});
