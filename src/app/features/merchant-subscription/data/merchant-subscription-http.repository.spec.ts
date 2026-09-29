import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildOverview } from '../testing/merchant-subscription-fixture';
import { MerchantSubscriptionHttpRepository } from './merchant-subscription-http.repository';

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
      ],
    });
    repository = TestBed.inject(MerchantSubscriptionHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads the whole subscription page in one call', async () => {
    const response = firstValueFrom(repository.getOverview());

    const request = http.expectOne('https://api.test/owner/subscription');
    expect(request.request.method).toBe('GET');
    request.flush(buildOverview());
    expect((await response).current.plan.name).toBe('الباقة الأساسية');
  });

  it('sends a plan change as JSON', async () => {
    const response = firstValueFrom(
      repository.requestPlanChange({ kind: 'upgrade', planId: 'plan-featured', term: 'yearly' }),
    );

    const request = http.expectOne('https://api.test/owner/subscription/requests');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      kind: 'upgrade',
      planId: 'plan-featured',
      term: 'yearly',
    });
    request.flush({ id: 'request-9', status: 'pending' });
    expect((await response).id).toBe('request-9');
  });
});
