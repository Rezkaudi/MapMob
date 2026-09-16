import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from './app.routes';
import { AuthRepository } from './features/auth/data/auth.repository';
import { AuthStore } from './features/auth/state/auth.store';
import { PlanMockDatabase } from './features/subscriptions/data/plan-mock-database';
import { MOCK_PLANS } from './features/subscriptions/data/plan-mock-samples';
import { SubscriptionMockDatabase } from './features/subscriptions/data/subscription-mock-database';
import { SubscriptionMockRepository } from './features/subscriptions/data/subscription-mock.repository';
import { SubscriptionRepository } from './features/subscriptions/data/subscription.repository';

const USER = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

describe('app routes', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: AuthRepository, useValue: { signIn: () => of(USER) } },
        // Feature repositories live in `app.config.ts`, which these route tests do not load.
        { provide: PlanMockDatabase, useFactory: () => new PlanMockDatabase(MOCK_PLANS) },
        { provide: SubscriptionMockDatabase, useFactory: () => new SubscriptionMockDatabase([]) },
        { provide: SubscriptionRepository, useClass: SubscriptionMockRepository },
      ],
    });
  });

  function signIn(): void {
    TestBed.inject(AuthStore).signIn({ email: 'admin@admin.com', password: 'admin' });
  }

  it('sends a signed-out visitor to the login page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');

    expect(TestBed.inject(Location).path()).toBe('/login');
  });

  it('sends the root URL of a signed-out visitor to the login page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    expect(TestBed.inject(Location).path()).toBe('/login');
  });

  it('sends an unknown URL to the not-found page', async () => {
    signIn();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/there-is-no-such-page');

    expect(TestBed.inject(Location).path()).toBe('/not-found');
    expect(harness.fixture.nativeElement.textContent).toContain('الصفحة غير موجودة');
  });

  it('sends a nav link with no feature behind it to the not-found page', async () => {
    signIn();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile');

    expect(TestBed.inject(Location).path()).toBe('/not-found');
  });

  it('renders the not-found page inside the admin shell', async () => {
    signIn();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/payments');

    const el = harness.fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-sidebar')).toBeTruthy();
    expect(el.querySelector('app-top-bar')).toBeTruthy();
  });

  it('serves the subscriptions page behind its nav link', async () => {
    signIn();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/subscriptions');

    expect(TestBed.inject(Location).path()).toBe('/subscriptions');
    expect(harness.fixture.nativeElement.querySelector('app-subscription-hub')).toBeTruthy();
  });

  it('serves the not-found page directly', async () => {
    signIn();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/not-found');

    expect(harness.fixture.nativeElement.querySelector('app-not-found')).toBeTruthy();
  });
});
