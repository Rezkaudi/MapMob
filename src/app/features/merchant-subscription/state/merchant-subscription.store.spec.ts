import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { MerchantSubscriptionRepository } from '../data/merchant-subscription.repository';
import { MerchantSubscriptionOverview } from '../models/merchant-subscription-overview';
import { PlanChangeDraft } from '../models/plan-change-draft';
import { PlanChangeRequest } from '../models/plan-change-request';
import { FREE_RECORD, buildOverview } from '../testing/merchant-subscription-fixture';
import { MerchantSubscriptionStore } from './merchant-subscription.store';

const EARLY_IN_PERIOD = new Date('2026-09-10T09:00:00');
const LAST_WEEK = new Date('2026-09-29T09:00:00');

class FakeRepository extends MerchantSubscriptionRepository {
  overview: MerchantSubscriptionOverview = buildOverview();
  failure: Error | null = null;
  sent: PlanChangeDraft[] = [];

  getOverview(): Observable<MerchantSubscriptionOverview> {
    return this.answer(this.overview);
  }
  requestPlanChange(draft: PlanChangeDraft): Observable<PlanChangeRequest> {
    this.sent.push(draft);
    return this.answer({
      id: 'request-1',
      kind: draft.kind,
      plan: { id: draft.planId, name: 'x' },
      term: draft.term,
      status: 'pending',
      createdAt: '2026-09-10T09:00:00Z',
    });
  }
  private answer<T>(value: T): Observable<T> {
    return this.failure ? throwError(() => this.failure) : of(value);
  }
}

function setUp(now = EARLY_IN_PERIOD, configure: (repository: FakeRepository) => void = () => {}) {
  const repository = new FakeRepository();
  configure(repository);
  TestBed.configureTestingModule({
    providers: [
      MerchantSubscriptionStore,
      { provide: MerchantSubscriptionRepository, useValue: repository },
      { provide: CLOCK, useValue: () => now },
    ],
  });
  const store = TestBed.inject(MerchantSubscriptionStore);
  store.load();
  return { store, repository };
}

describe('MerchantSubscriptionStore', () => {
  it('derives every section of the page from one load', () => {
    const { store } = setUp();

    expect(store.hero()?.planName).toBe('الباقة الأساسية');
    expect(store.usageCards()).toHaveLength(4);
    expect(store.planCards().map((card) => card.action.kind)).toEqual([
      'downgrade',
      'current',
      'upgrade',
    ]);
    expect(store.historyRows()).toHaveLength(2);
  });

  it('keeps the load error for the page to show', () => {
    const { store } = setUp(EARLY_IN_PERIOD, (repository) => {
      repository.failure = new Error('انقطع الاتصال');
    });

    expect(store.error()).toBe('انقطع الاتصال');
    expect(store.hero()).toBeNull();
  });

  it('reprices the plan cards when the cycle changes', () => {
    const { store } = setUp();

    store.selectCycle('yearly');

    expect(store.cycle()).toBe('yearly');
    expect(store.planCards()[1].periodText).toBe('/ سنوياً');
  });

  it('opens the details of the current period and of a past one', () => {
    const { store } = setUp();

    store.openCurrentDetails();
    expect(store.detailsView()?.planName).toBe('الباقة الأساسية');

    store.openDetails(FREE_RECORD);
    expect(store.detailsView()?.planName).toBe('الباقة المجانية');
  });

  it('opens the upgrade request for the next tier from the hero', () => {
    const { store } = setUp();

    store.openHeroUpgrade();

    expect(store.requestView()?.rows[1].value).toBe('الباقة المميزة');
  });

  it("opens the dialog each plan card's button asks for", () => {
    const { store } = setUp(LAST_WEEK);
    const [free, basic, featured] = store.planCards();

    store.openPlanAction(free);
    expect(store.downgradeView()?.title).toBe('الانتقال إلى الباقة المجانية');

    store.openPlanAction(basic);
    expect(store.requestView()?.title).toBe('طلب تجديد الاشتراك');

    store.openPlanAction(featured);
    expect(store.requestView()?.title).toBe('طلب ترقية الباقة');
  });

  it('opens nothing from a disabled button', () => {
    const { store } = setUp();

    store.openPlanAction(store.planCards()[1]);

    expect(store.dialog()).toBeNull();
  });

  it('sends the open request, closes it and shows the plan as under review', async () => {
    const { store, repository } = setUp();
    store.openHeroUpgrade();

    await store.submitRequest();

    expect(repository.sent).toEqual([
      { kind: 'upgrade', planId: 'plan-featured', term: 'monthly' },
    ]);
    expect(store.dialog()).toBeNull();
    expect(store.isRequestSent()).toBe(true);
    expect(store.planCards()[2].action.kind).toBe('pending');
  });

  it('keeps the dialog open with the error when sending fails', async () => {
    const { store, repository } = setUp();
    store.openPlanAction(store.planCards()[0]);
    repository.failure = new Error('لديك طلب قيد المراجعة بالفعل.');

    await store.submitRequest();

    expect(store.downgradeView()).not.toBeNull();
    expect(store.saveError()).toBe('لديك طلب قيد المراجعة بالفعل.');
    expect(store.isRequestSent()).toBe(false);
  });

  it('clears the error when the dialog closes', async () => {
    const { store, repository } = setUp();
    store.openHeroUpgrade();
    repository.failure = new Error('x');
    await store.submitRequest();

    store.closeDialog();

    expect(store.dialog()).toBeNull();
    expect(store.saveError()).toBeNull();
  });
});
