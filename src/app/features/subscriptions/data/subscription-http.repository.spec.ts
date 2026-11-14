import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LIVE_GOLD_PLAN } from '../../../shared/testing/live-plan-fixture';
import { LIVE_SUBSCRIPTION } from '../testing/live-subscription-fixture';
import { SubscriptionHttpRepository } from './subscription-http.repository';

const BASE_URL = 'https://api.test';
const PLANS_URL = `${BASE_URL}/admin/plans`;
const SUBSCRIPTIONS_URL = `${BASE_URL}/admin/subscriptions`;
const EXPIRED_ROW = { ...LIVE_SUBSCRIPTION, id: 8, status: 'expired' };

describe('SubscriptionHttpRepository', () => {
  let repository: SubscriptionHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubscriptionHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        { provide: CLOCK, useValue: () => new Date(2026, 10, 1, 12) },
      ],
    });
    repository = TestBed.inject(SubscriptionHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads the plans with the subscriber count the server gives', async () => {
    const response = firstValueFrom(repository.getPlans());
    http.expectOne(PLANS_URL).flush({ data: [{ ...LIVE_GOLD_PLAN, subscriberCount: 3 }] });

    const [plan] = await response;
    expect(plan.id).toBe('1');
    expect(plan.subscriberCount).toBe(3);
  });

  it('asks the server for one filtered page and shows it as it comes', async () => {
    const response = firstValueFrom(
      repository.getSubscriptions({ pageIndex: 1, pageSize: 10, status: 'paused', tier: 'free' }),
    );

    http.expectOne(PLANS_URL).flush({ data: [LIVE_GOLD_PLAN] });
    const request = http.expectOne((call) => call.url === SUBSCRIPTIONS_URL);
    expect(request.request.params.get('status')).toBe('cancelled');
    expect(request.request.params.get('plan_tier')).toBe('free');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('per_page')).toBe('10');
    request.flush({ items: [LIVE_SUBSCRIPTION, EXPIRED_ROW], totalCount: 14 });

    const page = await response;
    expect(page.totalCount).toBe(14);
    expect(page.items.map((row) => row.id)).toEqual([String(LIVE_SUBSCRIPTION.id), '8']);
  });

  it('reads the counts from the server summary and the plans', async () => {
    const response = firstValueFrom(repository.getSummary());
    http.expectOne(`${SUBSCRIPTIONS_URL}/summary`).flush({
      data: {
        total_count: 2,
        pending_count: 0,
        active_count: 1,
        expired_count: 1,
        cancelled_count: 0,
        ending_soon_count: 1,
      },
    });
    http.expectOne(PLANS_URL).flush({ data: [{ ...LIVE_GOLD_PLAN, subscriberCount: 1 }] });

    expect(await response).toEqual({
      topPlanName: 'الباقة الذهبية',
      topPlanSubscriberCount: 1,
      availablePlanCount: 1,
      endingSoonCount: 1,
      activeSubscriberCount: 1,
      activeSubscriberShare: 0.5,
    });
  });

  it('saves a plan with PUT and reads the plans again', async () => {
    const response = firstValueFrom(repository.setPlanActive('1', false));

    const request = http.expectOne(`${PLANS_URL}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ is_active: false });
    request.flush({ data: { ...LIVE_GOLD_PLAN, is_active: false } });
    http.expectOne(PLANS_URL).flush({ data: [{ ...LIVE_GOLD_PLAN, is_active: false }] });

    expect((await response).isActive).toBe(false);
  });

  it('still answers with the saved plan when the list hides inactive plans', async () => {
    const response = firstValueFrom(repository.setPlanActive('1', false));

    http.expectOne(`${PLANS_URL}/1`).flush({ data: { ...LIVE_GOLD_PLAN, is_active: false } });
    http.expectOne(PLANS_URL).flush({ data: [] });

    const saved = await response;
    expect(saved.id).toBe('1');
    expect(saved.isActive).toBe(false);
  });

  it('creates a plan with a slug and a month of days, then reads the plans again', async () => {
    const response = firstValueFrom(
      repository.createPlan({
        name: 'فضية',
        isActive: true,
        monthlyPrice: 5000,
        yearlyPrice: null,
        currency: 'SYP',
        limits: {
          adsPerMonth: 1,
          activeOffers: 2,
          galleryImages: 3,
          videos: null,
          activeStories: 2,
        },
        features: [],
      }),
    );

    const request = http.expectOne({ method: 'POST', url: PLANS_URL });
    expect(request.request.body.slug).toBe('فضية');
    expect(request.request.body.duration_days).toBe(30);
    expect(request.request.body.price).toBe(5000);
    request.flush({ data: { ...LIVE_GOLD_PLAN, id: 8, name: 'فضية', price: 5000 } });
    http
      .expectOne(PLANS_URL)
      .flush({ data: [LIVE_GOLD_PLAN, { ...LIVE_GOLD_PLAN, id: 8, name: 'فضية', price: 5000 }] });

    const created = await response;
    expect(created.id).toBe('8');
    expect(created.tier).toBe('basic');
  });

  it('deletes a plan and leaves the "in use" refusal to the server', async () => {
    const response = firstValueFrom(repository.deletePlan('1'), { defaultValue: undefined });

    const request = http.expectOne(`${PLANS_URL}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ status_code: 200 });

    expect(await response).toBeUndefined();
  });

  it('cancels a subscription with DELETE', async () => {
    const response = firstValueFrom(repository.cancelSubscription('7'));

    http.expectOne({ method: 'DELETE', url: `${SUBSCRIPTIONS_URL}/7` }).flush({});

    expect(await response).toBeUndefined();
  });

  it('downloads the server file when it can apply the filters itself', async () => {
    const response = firstValueFrom(
      repository.exportSubscriptions({ pageIndex: 2, pageSize: 10, status: 'expired' }),
    );

    http.expectOne(PLANS_URL).flush({ data: [LIVE_GOLD_PLAN] });
    const request = http.expectOne((call) => call.url === `${SUBSCRIPTIONS_URL}/export`);
    expect(request.request.params.get('status')).toBe('expired');
    expect(request.request.params.has('page')).toBe(false);
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob(['csv'], { type: 'text/csv' }));

    expect((await response).type).toContain('text/csv');
  });

  it('downloads the server file with every table filter, even ones the server may ignore', async () => {
    const response = firstValueFrom(
      repository.exportSubscriptions({
        pageIndex: 0,
        pageSize: 10,
        search: 'دمشق',
        status: 'paused',
        tier: 'featured',
      }),
    );

    http.expectOne(PLANS_URL).flush({ data: [LIVE_GOLD_PLAN] });
    const request = http.expectOne((call) => call.url === `${SUBSCRIPTIONS_URL}/export`);
    expect(request.request.params.get('search')).toBe('دمشق');
    expect(request.request.params.get('status')).toBe('cancelled');
    expect(request.request.params.get('plan_tier')).toBe(LIVE_GOLD_PLAN.slug);
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob(['csv'], { type: 'text/csv' }));

    expect((await response).type).toContain('text/csv');
  });
});
