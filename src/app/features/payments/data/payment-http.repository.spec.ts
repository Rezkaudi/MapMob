import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LIVE_GOLD_PLAN } from '../../../shared/testing/live-plan-fixture';
import {
  LIVE_PAYMENT,
  LIVE_PAYMENT_STORE,
  LIVE_PAYMENT_SUBSCRIPTION,
} from '../testing/live-payment-fixture';
import { PaymentHttpRepository } from './payment-http.repository';

const BASE_URL = 'https://api.test';
const PAYMENTS_URL = `${BASE_URL}/admin/payments`;
const CASH_IN_SYP = { ...LIVE_PAYMENT, id: 2, currency_code: 'SYP', store: { id: 4, name: 'حلب' } };

describe('PaymentHttpRepository', () => {
  let repository: PaymentHttpRepository;
  let http: HttpTestingController;

  function answerList(): void {
    http
      .expectOne((request) => request.url === PAYMENTS_URL && request.method === 'GET')
      .flush({ data: [LIVE_PAYMENT, CASH_IN_SYP], pagination: { total: 2 } });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        { provide: CLOCK, useValue: () => new Date(2026, 9, 14, 12) },
      ],
    });
    repository = TestBed.inject(PaymentHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads all payments in one call and filters and pages them here', async () => {
    const response = firstValueFrom(
      repository.getPayments({ pageIndex: 0, pageSize: 10, currency: 'SYP' }),
    );

    const request = http.expectOne((candidate) => candidate.url === PAYMENTS_URL);
    expect(request.request.params.get('per_page')).toBe('1000');
    request.flush({ data: [LIVE_PAYMENT, CASH_IN_SYP], pagination: { total: 2 } });

    const page = await response;
    expect(page.totalCount).toBe(1);
    expect(page.items[0].companyName).toBe('حلب');
  });

  it('counts the summary from the list', async () => {
    const response = firstValueFrom(repository.getSummary());
    answerList();

    expect((await response).transactionCount).toBe(2);
  });

  it('reads one payment with its store and subscription', async () => {
    const response = firstValueFrom(repository.getPaymentDetail('1'));

    http.expectOne(`${PAYMENTS_URL}/1`).flush({ data: LIVE_PAYMENT });
    http.expectOne(`${BASE_URL}/admin/stores/1`).flush({ data: LIVE_PAYMENT_STORE });
    http.expectOne(`${BASE_URL}/admin/subscriptions/1`).flush({ data: LIVE_PAYMENT_SUBSCRIPTION });

    const detail = await response;
    expect(detail.company.type).toBe('مطاعم');
    expect(detail.subscription?.planName).toBe('الباقة الذهبية');
  });

  it('still opens a payment whose store or subscription is gone', async () => {
    const response = firstValueFrom(repository.getPaymentDetail('1'));

    http.expectOne(`${PAYMENTS_URL}/1`).flush({ data: LIVE_PAYMENT });
    http
      .expectOne(`${BASE_URL}/admin/stores/1`)
      .flush({}, { status: 404, statusText: 'Not Found' });
    http
      .expectOne(`${BASE_URL}/admin/subscriptions/1`)
      .flush({}, { status: 404, statusText: 'Not Found' });

    expect((await response).subscription).toBeNull();
  });

  it('builds the dialog choices from the stores, subscriptions and plans', async () => {
    const response = firstValueFrom(repository.getPaymentFormOptions());

    http
      .expectOne((request) => request.url === `${BASE_URL}/admin/stores`)
      .flush({ items: [{ id: '1', name: 'متجر دمشق' }], totalCount: 1 });
    http
      .expectOne(`${BASE_URL}/admin/subscriptions`)
      .flush({ items: [LIVE_PAYMENT_SUBSCRIPTION], totalCount: 1 });
    http.expectOne(`${BASE_URL}/admin/plans`).flush({ data: [LIVE_GOLD_PLAN] });

    const options = await response;
    expect(options.merchants[0].currentPlanName).toBe('الباقة الذهبية');
    expect(options.plans[0].monthlyPrice).toBe(150000);
  });

  it('records the subscription first, then the payment tied to it', async () => {
    const response = firstValueFrom(
      repository.createPayment({
        merchantId: '1',
        kind: 'renewal',
        planId: '1',
        term: 'monthly',
        amount: 25,
        currency: 'USD',
        paidAt: '2026-10-14',
        startsOn: '2026-11-04',
        endsOn: '2026-12-03',
        notes: '',
      }),
    );

    const subscription = http.expectOne({ method: 'POST', url: `${BASE_URL}/admin/subscriptions` });
    expect(subscription.request.body.plan_id).toBe('1');
    subscription.flush({ data: { ...LIVE_PAYMENT_SUBSCRIPTION, id: 9 } });
    const payment = http.expectOne({ method: 'POST', url: PAYMENTS_URL });
    expect(payment.request.body.subscription_id).toBe(9);
    payment.flush({ data: { ...LIVE_PAYMENT, id: 5, subscription_id: 9 } });

    expect((await response).id).toBe('5');
  });

  it('builds the export file here, so it has the table columns', async () => {
    const response = firstValueFrom(repository.exportPayments({ pageIndex: 0, pageSize: 10 }));
    answerList();

    expect((await response).type).toContain('text/csv');
  });
});
