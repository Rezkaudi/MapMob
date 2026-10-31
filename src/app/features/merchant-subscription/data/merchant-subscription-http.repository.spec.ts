import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveOwnerPlan } from './live-owner-plan';
import { LiveOwnerSubscription } from './live-owner-subscription';
import { MerchantSubscriptionHttpRepository } from './merchant-subscription-http.repository';

const SUBSCRIPTION_URL = 'https://api.test/owner/subscription';

function buildLivePlan(overrides: Partial<LiveOwnerPlan> = {}): LiveOwnerPlan {
  return {
    id: '1',
    name: 'الباقة الذهبية',
    price: 150000,
    currencyCode: 'SYP',
    billingCycle: 'monthly',
    maxAds: 10,
    maxOffers: 5,
    maxProducts: 100,
    maxImages: 20,
    features: ['دعم فني'],
    ...overrides,
  };
}

const CURRENT: LiveOwnerSubscription = {
  id: '12',
  plan: buildLivePlan(),
  startsAt: '2026-10-29T00:00:00+00:00',
  endsAt: '2026-11-27T23:59:59+00:00',
  status: 'active',
  paymentMethod: null,
  amountPaid: null,
  currencyCode: 'SYP',
};

const USAGE = {
  productsAndServices: { used: 3, limit: 100 },
  media: { used: 1, limit: 20 },
  offers: { used: 2, limit: 5 },
  ads: { used: 0, limit: 10 },
};

describe('MerchantSubscriptionHttpRepository', () => {
  let repository: MerchantSubscriptionHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MerchantSubscriptionHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
        { provide: CLOCK, useValue: () => new Date('2026-10-29T10:00:00Z') },
      ],
    });
    repository = TestBed.inject(MerchantSubscriptionHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads the current plan, the usage, the plans cheapest first and the open request', async () => {
    const response = firstValueFrom(repository.getOverview());

    http.expectOne(SUBSCRIPTION_URL).flush({
      status_code: 200,
      data: {
        current: CURRENT,
        history: [CURRENT],
        availablePlans: [
          buildLivePlan(),
          buildLivePlan({ id: '2', name: 'المجانية', price: 0, maxAds: 0 }),
          buildLivePlan({ id: '3', name: 'الأساسية', price: 50000 }),
        ],
        usage: USAGE,
        requests: [
          {
            id: '1',
            requestType: 'upgrade',
            plan: buildLivePlan(),
            status: 'pending',
            createdAt: '2026-10-29T06:33:09+00:00',
          },
        ],
      },
    });

    const overview = await response;
    expect(overview.current).toEqual({
      id: '12',
      plan: { id: '1', name: 'الباقة الذهبية' },
      term: 'monthly',
      price: { amount: 150000, currency: 'SYP' },
      paymentMethod: 'cash',
      startsOn: '2026-10-29',
      endsOn: '2026-11-27',
      status: 'active',
    });
    expect(overview.history).toHaveLength(1);
    expect(overview.plans.map((plan) => [plan.id, plan.tier])).toEqual([
      ['2', 'free'],
      ['3', 'basic'],
      ['1', 'featured'],
    ]);
    expect(overview.plans[2]).toEqual({
      id: '1',
      name: 'الباقة الذهبية',
      tier: 'featured',
      tagline: '',
      monthlyPrice: 150000,
      yearlyPrice: null,
      currency: 'SYP',
      limits: { products: 100, adsPerMonth: 10, activeOffers: 5, galleryImages: 20, videos: 20 },
      features: ['دعم فني'],
    });
    expect(overview.usage).toEqual({
      products: { used: 3, limit: 100 },
      galleryImages: { used: 1, limit: 20 },
      activeOffers: { used: 2, limit: 5 },
      adsThisMonth: { used: 0, limit: 10 },
    });
    expect(overview.pendingRequest).toEqual({
      id: '1',
      kind: 'upgrade',
      plan: { id: '1', name: 'الباقة الذهبية' },
      term: 'monthly',
      status: 'pending',
      createdAt: '2026-10-29T06:33:09+00:00',
    });
  });

  it('stands in a "بدون باقة" record that has run out while the place has no plan', async () => {
    const response = firstValueFrom(repository.getOverview());

    http.expectOne(SUBSCRIPTION_URL).flush({
      data: { current: null, history: [], availablePlans: [], usage: USAGE, requests: [] },
    });

    const overview = await response;
    expect(overview.current).toEqual({
      id: '',
      plan: { id: '', name: 'بدون باقة' },
      term: 'monthly',
      price: { amount: 0, currency: 'SYP' },
      paymentMethod: 'cash',
      startsOn: '2026-10-29',
      endsOn: '2026-10-29',
      status: 'expired',
    });
    expect(overview.pendingRequest).toBeNull();
  });

  it('sends a plan change as requestType and planId', async () => {
    const response = firstValueFrom(
      repository.requestPlanChange({ kind: 'renewal', planId: '1', term: 'monthly' }),
    );

    const request = http.expectOne(`${SUBSCRIPTION_URL}/requests`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ requestType: 'renewal', planId: '1' });
    request.flush({
      status_code: 201,
      data: {
        id: '4',
        requestType: 'renewal',
        plan: buildLivePlan(),
        status: 'pending',
        createdAt: '2026-10-29T07:00:00+00:00',
      },
    });

    expect((await response).kind).toBe('renewal');
  });

  it('sends a downgrade as "discount", the word the server uses, and reads it back', async () => {
    const response = firstValueFrom(
      repository.requestPlanChange({ kind: 'downgrade', planId: '2', term: 'monthly' }),
    );

    const request = http.expectOne(`${SUBSCRIPTION_URL}/requests`);
    expect(request.request.body).toEqual({ requestType: 'discount', planId: '2' });
    request.flush({
      data: {
        id: '5',
        requestType: 'discount',
        plan: buildLivePlan({ id: '2' }),
        status: 'pending',
        createdAt: '2026-10-29T07:12:09+00:00',
      },
    });

    expect((await response).kind).toBe('downgrade');
  });
});
