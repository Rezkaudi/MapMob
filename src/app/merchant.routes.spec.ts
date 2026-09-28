import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from './app.routes';
import { MERCHANT_SUPPORT_URL } from './core/config/merchant-support-url';
import { AuthRepository } from './features/auth/data/auth.repository';
import { AuthStore } from './features/auth/state/auth.store';
import { MerchantAuthRepository } from './features/merchant-auth/data/merchant-auth.repository';
import { MerchantOverviewRepository } from './features/merchant-overview/data/merchant-overview.repository';
import {
  MERCHANT_OVERVIEW_SEED,
  buildStorePerformanceSeed,
} from './features/merchant-overview/data/merchant-overview-mock-seed';
import { StoreProfileRepository } from './features/merchant-store/data/store-profile.repository';
import { buildStoreProfile } from './features/merchant-store/testing/store-profile-fixture';
import { MerchantProductRepository } from './features/merchant-products/data/merchant-product.repository';
import { buildMerchantProductCatalog } from './features/merchant-products/testing/merchant-product-fixture';
import { MerchantOfferRepository } from './features/merchant-offers/data/merchant-offer.repository';
import { FakeMerchantOfferRepository } from './features/merchant-offers/testing/fake-merchant-offer-repository';

describe('merchant routes', () => {
  const MERCHANT = { id: 'm-1', name: 'أحمد', role: 'owner', avatarUrl: null, token: 't' };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: AuthRepository, useValue: {} },
        { provide: MerchantAuthRepository, useValue: {} },
        { provide: MERCHANT_SUPPORT_URL, useValue: 'mailto:help@example.com' },
        {
          provide: MerchantOverviewRepository,
          useValue: {
            getOverview: () => of(MERCHANT_OVERVIEW_SEED),
            getPerformance: () => of(buildStorePerformanceSeed('monthly')),
          },
        },
        {
          provide: StoreProfileRepository,
          useValue: { getProfile: () => of(buildStoreProfile()), saveProfile: () => of() },
        },
        {
          provide: MerchantProductRepository,
          useValue: { getCatalog: () => of(buildMerchantProductCatalog()) },
        },
        { provide: MerchantOfferRepository, useValue: new FakeMerchantOfferRepository() },
      ],
    });
  });

  it('sends the old /merchant/login to the merchant tab of the one login page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/merchant/login');

    const element = harness.fixture.nativeElement as HTMLElement;
    expect(TestBed.inject(Location).path()).toBe('/login?role=merchant');
    expect(element.querySelector('app-login app-merchant-sign-in-form')).toBeTruthy();
    expect(element.querySelector('app-sidebar')).toBeNull();
  });

  it('serves the forgot-password step to a signed-out visitor', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/merchant/forgot-password');

    expect(harness.fixture.nativeElement.querySelector('app-forgot-password')).toBeTruthy();
  });

  it('keeps the code step closed until a code was sent', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/merchant/reset-code');

    expect(TestBed.inject(Location).path()).toBe('/merchant/forgot-password');
  });

  it('sends a signed-out visitor from the merchant dashboard to the merchant login', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/merchant');

    expect(TestBed.inject(Location).path()).toBe('/login?role=merchant');
  });

  it('opens the merchant overview at /merchant/dashboard, inside the merchant shell', async () => {
    TestBed.inject(AuthStore).startSession(MERCHANT);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/merchant');

    expect(TestBed.inject(Location).path()).toBe('/merchant/dashboard');

    const element = harness.fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-merchant-shell app-merchant-home')).toBeTruthy();
  });

  it('opens the store data page at /merchant/store, inside the merchant shell', async () => {
    TestBed.inject(AuthStore).startSession(MERCHANT);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/merchant/store');

    expect(TestBed.inject(Location).path()).toBe('/merchant/store');
    const element = harness.fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-merchant-shell app-store-profile-page')).toBeTruthy();
  });

  it('opens the products page at /merchant/products, inside the merchant shell', async () => {
    TestBed.inject(AuthStore).startSession(MERCHANT);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/merchant/products');

    expect(TestBed.inject(Location).path()).toBe('/merchant/products');
    const element = harness.fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-merchant-shell app-merchant-products-page')).toBeTruthy();
  });

  it('opens the offers page at /merchant/offers, inside the merchant shell', async () => {
    TestBed.inject(AuthStore).startSession(MERCHANT);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/merchant/offers');

    expect(TestBed.inject(Location).path()).toBe('/merchant/offers');
    const element = harness.fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-merchant-shell app-merchant-offers-page')).toBeTruthy();
  });

  it('opens the add and edit offer pages, the edit page on its id', async () => {
    TestBed.inject(AuthStore).startSession(MERCHANT);
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/merchant/offers/new');
    const element = harness.fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-merchant-offer-form-page h1')?.textContent?.trim()).toBe(
      'إضافة عرض جديد',
    );

    await harness.navigateByUrl('/merchant/offers/offer-1/edit');
    harness.detectChanges();
    expect(element.querySelector('app-merchant-offer-form-page h1')?.textContent?.trim()).toBe(
      'تعديل العرض',
    );
  });

  it('sends a merchant link with no page yet to the not-found page, linking back to /merchant', async () => {
    TestBed.inject(AuthStore).startSession(MERCHANT);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/merchant/media');

    expect(TestBed.inject(Location).path()).toBe('/merchant/not-found');
    const element = harness.fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-merchant-shell app-not-found')).toBeTruthy();
    expect(element.querySelector('app-not-found a')!.getAttribute('href')).toBe(
      '/merchant/dashboard',
    );
  });

  it('sends a merchant who opens an admin page back to the merchant dashboard', async () => {
    TestBed.inject(AuthStore).startSession(MERCHANT);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/admin/dashboard');

    expect(TestBed.inject(Location).path()).toBe('/merchant/dashboard');
  });

  it('sends the root URL of a signed-in merchant to /merchant/dashboard', async () => {
    TestBed.inject(AuthStore).startSession(MERCHANT);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    expect(TestBed.inject(Location).path()).toBe('/merchant/dashboard');
  });
});
