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

  function answerLists(): void {
    http.expectOne(PLANS_URL).flush({ data: [LIVE_GOLD_PLAN] });
    http
      .expectOne(SUBSCRIPTIONS_URL)
      .flush({ items: [LIVE_SUBSCRIPTION, EXPIRED_ROW], totalCount: 2 });
  }

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

  it("reads the plans and counts each one's active subscribers", async () => {
    const response = firstValueFrom(repository.getPlans());
    answerLists();

    const [plan] = await response;
    expect(plan.id).toBe('1');
    expect(plan.subscriberCount).toBe(1);
  });

  it('filters and pages the subscription rows on this side', async () => {
    const response = firstValueFrom(
      repository.getSubscriptions({ pageIndex: 0, pageSize: 10, status: 'expired' }),
    );
    answerLists();

    const page = await response;
    expect(page.totalCount).toBe(1);
    expect(page.items[0].id).toBe('8');
  });

  it('counts the summary strip from the two lists', async () => {
    const response = firstValueFrom(repository.getSummary());
    answerLists();

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
    http.expectOne(SUBSCRIPTIONS_URL).flush({ items: [], totalCount: 0 });

    expect((await response).isActive).toBe(false);
  });

  it('still answers with the saved plan when the list hides inactive plans', async () => {
    const response = firstValueFrom(repository.setPlanActive('1', false));

    http.expectOne(`${PLANS_URL}/1`).flush({ data: { ...LIVE_GOLD_PLAN, is_active: false } });
    http.expectOne(PLANS_URL).flush({ data: [] });
    http.expectOne(SUBSCRIPTIONS_URL).flush({ items: [], totalCount: 0 });

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
        limits: { adsPerMonth: 1, activeOffers: 2, galleryImages: 3, videos: null },
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
    http.expectOne(SUBSCRIPTIONS_URL).flush({ items: [], totalCount: 0 });

    const created = await response;
    expect(created.id).toBe('8');
    expect(created.tier).toBe('basic');
  });

  it('refuses to delete a plan that still has subscribers, without calling the server', async () => {
    const response = firstValueFrom(repository.deletePlan('1'));
    answerLists();

    await expect(response).rejects.toThrow('لا يمكن حذف باقة عليها اشتراكات');
  });

  it('deletes a plan nobody uses', async () => {
    const response = firstValueFrom(repository.deletePlan('1'));
    http.expectOne(PLANS_URL).flush({ data: [LIVE_GOLD_PLAN] });
    http.expectOne(SUBSCRIPTIONS_URL).flush({ items: [], totalCount: 0 });

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

  it('builds the export file on this side', async () => {
    const response = firstValueFrom(repository.exportSubscriptions({ pageIndex: 0, pageSize: 10 }));
    answerLists();

    expect((await response).type).toContain('text/csv');
  });
});
