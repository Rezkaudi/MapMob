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

  it('asks the server for one filtered page and shows it as it comes', async () => {
    const response = firstValueFrom(
      repository.getPayments({ pageIndex: 1, pageSize: 10, currency: 'SYP' }),
    );

    const request = http.expectOne((candidate) => candidate.url === PAYMENTS_URL);
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('per_page')).toBe('10');
    request.flush({ data: [LIVE_PAYMENT, CASH_IN_SYP], pagination: { total: 12 } });

    const page = await response;
    expect(page.totalCount).toBe(12);
    expect(page.items.map((payment) => payment.companyName)).toEqual([
      LIVE_PAYMENT.store.name,
      'حلب',
    ]);
  });

  it('sends every picked filter in the list request', () => {
    repository
      .getPayments({
        pageIndex: 0,
        pageSize: 10,
        search: 'PAY',
        sort: 'newest',
        companyName: 'حلب',
        paymentMethod: 'cash',
        currency: 'SYP',
        paidOn: { from: '2026-11-01', to: '2026-11-08' },
      })
      .subscribe();

    const request = http.expectOne((candidate) => candidate.url === PAYMENTS_URL);
    const params = request.request.params;
    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['search', 'PAY'],
      ['sort_by', 'latest'],
      ['store_name', 'حلب'],
      ['payment_method', 'cash'],
      ['currency', 'SYP'],
      ['date_from', '2026-11-01'],
      ['date_to', '2026-11-08'],
      ['page', '1'],
      ['per_page', '10'],
    ]);
    request.flush({ data: [], pagination: { total: 0 } });
  });

  it('asks for the payments saved as "other" when the filter says آخرى', () => {
    repository.getPayments({ pageIndex: 0, pageSize: 10, paymentMethod: 'other' }).subscribe();

    const request = http.expectOne((candidate) => candidate.url === PAYMENTS_URL);
    expect(request.request.params.get('payment_method')).toBe('other');
    expect(request.request.params.has('payment_method_not')).toBe(false);
    request.flush({ data: [], pagination: { total: 0 } });
  });

  it('reads the cards from the summary route, the month card from this month on', async () => {
    const response = firstValueFrom(repository.getSummary());

    const summaries = http.match((candidate) => candidate.url === `${PAYMENTS_URL}/summary`);
    expect(summaries.map((request) => request.request.params.get('date_from'))).toEqual([
      null,
      '2026-10-01',
    ]);
    summaries[0].flush({
      data: { total_amount: '900.50', total_count: 7, paid_count: 5, pending_count: 2 },
    });
    summaries[1].flush({
      data: { total_amount: '120.00', total_count: 2, paid_count: 2, pending_count: 0 },
    });

    expect(await response).toEqual({
      transactionCount: 7,
      pendingCount: 2,
      cumulativeTotal: 900.5,
      monthTotal: 120,
    });
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
      .expectOne(`${BASE_URL}/admin/offers/formoptions`)
      .flush({ data: { stores: [{ id: 1, name: 'متجر دمشق' }] } });
    http
      .expectOne(`${BASE_URL}/admin/subscriptions`)
      .flush({ items: [LIVE_PAYMENT_SUBSCRIPTION], totalCount: 1 });
    http.expectOne(`${BASE_URL}/admin/plans`).flush({ data: [LIVE_GOLD_PLAN] });

    const options = await response;
    expect(options.merchants[0].id).toBe('1');
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
        paymentMethod: 'other',
      }),
    );

    const subscription = http.expectOne({ method: 'POST', url: `${BASE_URL}/admin/subscriptions` });
    expect(subscription.request.body.plan_id).toBe('1');
    subscription.flush({ data: { ...LIVE_PAYMENT_SUBSCRIPTION, id: 9 } });
    const payment = http.expectOne({ method: 'POST', url: PAYMENTS_URL });
    expect(payment.request.body.payment_method).toBe('other');
    expect(payment.request.body.subscription_id).toBe(9);
    payment.flush({ data: { ...LIVE_PAYMENT, id: 5, subscription_id: 9 } });

    expect((await response).id).toBe('5');
  });

  it('sends the changed amount, currency, day and notes with the names the create call uses', async () => {
    const response = firstValueFrom(
      repository.updatePayment('5', {
        amount: 30,
        currency: 'SYP',
        paidAt: '2026-11-02',
        notes: 'تصحيح المبلغ',
      }),
    );

    const request = http.expectOne({ method: 'PUT', url: `${PAYMENTS_URL}/5` });
    expect(request.request.body).toEqual({
      amount: 30,
      currency_code: 'SYP',
      paid_at: '2026-11-02',
      notes: 'تصحيح المبلغ',
    });
    request.flush({ data: { ...LIVE_PAYMENT, id: 5, amount: '30.00', currency_code: 'SYP' } });

    expect(await response).toMatchObject({ id: '5', amount: 30, currency: 'SYP' });
  });

  it('deletes a payment by its id', async () => {
    const response = firstValueFrom(repository.deletePayment('5'), { defaultValue: null });

    http.expectOne({ method: 'DELETE', url: `${PAYMENTS_URL}/5` }).flush(null);

    await expect(response).resolves.toBeNull();
  });

  it('downloads the export file from the server, with the table filters', async () => {
    const file = new Blob(['ID'], { type: 'text/csv' });
    const response = firstValueFrom(
      repository.exportPayments({
        pageIndex: 0,
        pageSize: 10,
        paymentMethod: 'other',
        currency: 'USD',
      }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${PAYMENTS_URL}/export`);
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('payment_method')).toBe('other');
    expect(request.request.params.get('currency')).toBe('USD');
    expect(request.request.params.has('per_page')).toBe(false);
    request.flush(file);

    expect(await response).toBe(file);
  });
});
