import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from './app.routes';
import { AuthRepository } from './features/auth/data/auth.repository';
import { AuthStore } from './features/auth/state/auth.store';
import { ComplaintRepository } from './features/complaints/data/complaint.repository';
import { NotificationRepository } from './features/notifications/data/notification.repository';
import { PaymentRepository } from './features/payments/data/payment.repository';
import { ReportsRepository } from './features/reports/data/reports.repository';
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
        {
          provide: PaymentRepository,
          useValue: {
            getPayments: () => of({ items: [], totalCount: 0 }),
            getSummary: () =>
              of({ pendingCount: 0, transactionCount: 0, monthTotal: 0, cumulativeTotal: 0 }),
          },
        },
        {
          provide: NotificationRepository,
          useValue: {
            getNotifications: () => of({ items: [], totalCount: 0 }),
            getSummary: () => of({ totalCount: 0, sentCount: 0, scheduledCount: 0, draftCount: 0 }),
          },
        },
        {
          provide: ComplaintRepository,
          useValue: {
            getComplaints: () => of({ items: [], totalCount: 0 }),
            getSummary: () =>
              of({
                totalCount: 0,
                newCount: 0,
                inReviewCount: 0,
                resolvedCount: 0,
                rejectedCount: 0,
              }),
          },
        },
        {
          provide: ReportsRepository,
          useValue: {
            getCategoryShares: () => of([]),
            getGovernorateActivities: () => of([]),
            getGrowthSeries: () => of([]),
            getUsageMetrics: () => of([]),
            getRevenueSeries: () => of({ name: '', points: [] }),
          },
        },
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
    await harness.navigateByUrl('/content');

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

  it('serves the payments page behind its nav link', async () => {
    signIn();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/payments');

    expect(TestBed.inject(Location).path()).toBe('/payments');
    expect(harness.fixture.nativeElement.querySelector('app-payment-list')).toBeTruthy();
  });

  it('serves the reports page behind its nav link', async () => {
    signIn();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/reports');

    expect(TestBed.inject(Location).path()).toBe('/reports');
    expect(harness.fixture.nativeElement.querySelector('app-report-overview')).toBeTruthy();
  });

  it('serves the notifications page behind its nav link', async () => {
    signIn();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/notifications');

    expect(TestBed.inject(Location).path()).toBe('/notifications');
    expect(harness.fixture.nativeElement.querySelector('app-notification-list')).toBeTruthy();
  });

  it('serves the complaints page behind its nav link', async () => {
    signIn();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/complaints');

    expect(TestBed.inject(Location).path()).toBe('/complaints');
    expect(harness.fixture.nativeElement.querySelector('app-complaint-list')).toBeTruthy();
  });

  it('serves the not-found page directly', async () => {
    signIn();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/not-found');

    expect(harness.fixture.nativeElement.querySelector('app-not-found')).toBeTruthy();
  });
});
