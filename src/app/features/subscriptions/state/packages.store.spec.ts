import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { MOCK_PLANS } from '../data/plan-mock-samples';
import { Subscription } from '../models/subscription';
import { SubscriptionRepository } from '../data/subscription.repository';
import { PackagePlan } from '../models/package-plan';
import { PlanDraft } from '../models/plan-draft';
import { SubscriptionSummary } from '../models/subscription-summary';
import { PackagesStore } from './packages.store';

const summary: SubscriptionSummary = {
  topPlanName: 'أساسية',
  topPlanSubscriberCount: 620,
  availablePlanCount: 3,
  endingSoonCount: 7,
  activeSubscriberCount: 1200,
  activeSubscriberShare: 0.9,
};

class FakeRepository implements SubscriptionRepository {
  hasNoPlans = false;
  plansError: string | null = null;
  saveError: string | null = null;
  readonly deleted: string[] = [];

  getSummary(): Observable<SubscriptionSummary> {
    return of(summary);
  }

  getPlans(): Observable<readonly PackagePlan[]> {
    if (this.plansError) {
      return throwError(() => new Error(this.plansError!));
    }
    return of(this.hasNoPlans ? [] : MOCK_PLANS);
  }

  updatePlan(id: string, draft: PlanDraft): Observable<PackagePlan> {
    if (this.saveError) {
      return throwError(() => new Error(this.saveError!));
    }
    return of({ ...MOCK_PLANS[1], id, name: draft.name });
  }

  setPlanActive(id: string, isActive: boolean): Observable<PackagePlan> {
    return of({ ...MOCK_PLANS[0], id, isActive });
  }

  deletePlan(id: string): Observable<void> {
    this.deleted.push(id);
    return of(undefined);
  }

  // The records tab has its own store; these are here only to satisfy the contract.
  getSubscriptions(): Observable<PagedResult<Subscription>> {
    return of({ items: [], totalCount: 0 });
  }

  exportSubscriptions(): Observable<Blob> {
    return of(new Blob());
  }
}

function setUp() {
  const repository = new FakeRepository();
  TestBed.configureTestingModule({
    providers: [{ provide: SubscriptionRepository, useValue: repository }],
  });
  return { repository, store: TestBed.inject(PackagesStore) };
}

describe('PackagesStore', () => {
  it('loads the packages and the summary cards', () => {
    const { store } = setUp();

    store.load();

    expect(store.plans()).toHaveLength(3);
    expect(store.statCards()).toHaveLength(4);
    expect(store.statCards()[3].value).toBe('أساسية');
  });

  it('reports a load failure instead of showing an empty page', () => {
    const { repository, store } = setUp();
    repository.plansError = 'تعذر تحميل الباقات';

    store.load();

    expect(store.error()).toBe('تعذر تحميل الباقات');
  });

  it('stays quiet about an empty list until the first load answers', () => {
    const { repository, store } = setUp();
    repository.hasNoPlans = true;

    expect(store.hasNoPlans()).toBe(false);

    store.load();

    expect(store.hasNoPlans()).toBe(true);
  });

  it('puts an edited package back in the list', async () => {
    const { store } = setUp();
    store.load();

    const saved = await store.savePlan('basic', { ...editDraft(), name: 'الباقة الأساسية' });

    expect(saved).toBe(true);
    expect(store.plans().find((plan) => plan.id === 'basic')?.name).toBe('الباقة الأساسية');
  });

  it('keeps the dialog open and reports why a save failed', async () => {
    const { repository, store } = setUp();
    store.load();
    repository.saveError = 'تعذر حفظ الباقة';

    const saved = await store.savePlan('basic', editDraft());

    expect(saved).toBe(false);
    expect(store.saveError()).toBe('تعذر حفظ الباقة');
  });

  it('flips a package between active and paused', async () => {
    const { store } = setUp();
    store.load();

    await store.setPlanActive('free', false);

    expect(store.plans().find((plan) => plan.id === 'free')?.isActive).toBe(false);
  });

  it('drops a deleted package from the list', async () => {
    const { repository, store } = setUp();
    store.load();

    await store.deletePlan('free');

    expect(repository.deleted).toEqual(['free']);
    expect(store.plans().map((plan) => plan.id)).toEqual(['basic', 'featured']);
  });
});

function editDraft(): PlanDraft {
  return {
    name: 'أساسية',
    isActive: true,
    monthlyPrice: 20,
    yearlyPrice: 950,
    currency: 'دولار',
    limits: { adsPerMonth: 10, activeOffers: 20, galleryImages: 30, videos: 30 },
    features: ['كل مزايا الباقة المجانية'],
  };
}
