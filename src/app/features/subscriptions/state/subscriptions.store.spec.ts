import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { SubscriptionRepository } from '../data/subscription.repository';
import { Subscription } from '../models/subscription';
import { NO_SUBSCRIPTION_FILTERS } from '../models/subscription-filters';
import { SubscriptionQuery } from '../models/subscription-query';
import { SubscriptionsStore } from './subscriptions.store';

function entry(id: string): Subscription {
  return {
    id,
    companyName: 'صيدلية الحياة',
    planName: 'أساسية',
    planTier: 'basic',
    price: 12,
    currencySymbol: '$',
    startedOn: '2024-01-12',
    endsOn: '2025-01-12',
    status: 'active',
  };
}

class FakeRepository {
  lastQuery: SubscriptionQuery | null = null;
  items: readonly Subscription[] = [entry('a'), entry('b')];
  loadError: string | null = null;
  exportError: string | null = null;

  getSubscriptions(query: SubscriptionQuery): Observable<PagedResult<Subscription>> {
    this.lastQuery = query;
    if (this.loadError) {
      return throwError(() => new Error(this.loadError!));
    }
    return of({ items: this.items, totalCount: this.items.length });
  }

  exportSubscriptions(): Observable<Blob> {
    return this.exportError
      ? throwError(() => new Error(this.exportError!))
      : of(new Blob(['csv']));
  }
}

function setUp() {
  const repository = new FakeRepository();
  TestBed.configureTestingModule({
    providers: [{ provide: SubscriptionRepository, useValue: repository }],
  });
  return { repository, store: TestBed.inject(SubscriptionsStore) };
}

describe('SubscriptionsStore', () => {
  it('loads a page of four rows, as the design draws', () => {
    const { repository, store } = setUp();

    store.loadSubscriptions();

    expect(repository.lastQuery?.pageSize).toBe(4);
    expect(store.entries()).toHaveLength(2);
  });

  it('reports a load failure', () => {
    const { repository, store } = setUp();
    repository.loadError = 'تعذر تحميل الاشتراكات';

    store.loadSubscriptions();

    expect(store.error()).toBe('تعذر تحميل الاشتراكات');
  });

  it('sends the picked filters with the query', () => {
    const { repository, store } = setUp();

    store.applyFilters({
      tier: 'featured',
      status: 'paused',
      subscribedRange: { from: '2026-08-01', to: '2026-09-02' },
    });

    expect(repository.lastQuery).toMatchObject({
      tier: 'featured',
      status: 'paused',
      subscribedFrom: '2026-08-01',
      subscribedTo: '2026-09-02',
    });
    expect(store.activeFilterCount()).toBe(3);
  });

  it('goes back to the first page when the filters change', () => {
    const { repository, store } = setUp();
    store.changePage(2);

    store.applyFilters({ ...NO_SUBSCRIPTION_FILTERS, status: 'active' });

    expect(repository.lastQuery?.pageIndex).toBe(0);
  });

  it('says nothing is subscribed only when no filter is narrowing the list', () => {
    const { repository, store } = setUp();
    repository.items = [];

    store.loadSubscriptions();

    expect(store.hasNoSubscriptions()).toBe(true);
    expect(store.emptyMessage()).toBe('لا توجد اشتراكات لعرضها');

    store.applyFilters({ ...NO_SUBSCRIPTION_FILTERS, status: 'active' });

    expect(store.hasNoSubscriptions()).toBe(false);
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });

  it('answers the export with a file', async () => {
    const { store } = setUp();

    expect(await store.exportSubscriptions()).toBeInstanceOf(Blob);
    expect(store.isExporting()).toBe(false);
  });

  it('reports why an export failed instead of saving an empty file', async () => {
    const { repository, store } = setUp();
    repository.exportError = 'تعذر تصدير الاشتراكات';

    expect(await store.exportSubscriptions()).toBeNull();
    expect(store.saveError()).toBe('تعذر تصدير الاشتراكات');
  });
});
