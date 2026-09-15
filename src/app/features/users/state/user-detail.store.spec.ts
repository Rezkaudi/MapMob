import { TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { UserRepository } from '../data/user.repository';
import { UserDetail } from '../models/user-detail';
import { buildUserDetail } from '../testing/user-fixture';
import { UserDetailStore } from './user-detail.store';

const NOW = new Date('2024-01-14T00:00:00.000Z');

function favoritesOf(count: number): UserDetail['favoritePlaces'] {
  const [favorite] = buildUserDetail().favoritePlaces;
  return Array.from({ length: count }, (_, index) => ({ ...favorite, id: `favorite-${index}` }));
}

function createStore(repository: Partial<UserRepository>) {
  TestBed.configureTestingModule({
    providers: [
      UserDetailStore,
      { provide: UserRepository, useValue: repository },
      { provide: CLOCK, useValue: () => NOW },
    ],
  });
  return TestBed.inject(UserDetailStore);
}

describe('UserDetailStore', () => {
  it('loads a user and exposes the page view', () => {
    let requestedId = '';
    const store = createStore({
      getUserDetail: (id) => {
        requestedId = id;
        return of(buildUserDetail());
      },
    });

    store.loadUser('user-1');

    expect(requestedId).toBe('user-1');
    expect(store.isLoading()).toBe(false);
    expect(store.profile()?.initials).toBe('أ ج');
    expect(store.statCards()).toHaveLength(4);
    expect(store.activityRows()).toHaveLength(1);
  });

  it('is loading until the user arrives', () => {
    const store = createStore({ getUserDetail: () => NEVER });

    store.loadUser('user-1');

    expect(store.isLoading()).toBe(true);
    expect(store.profile()).toBeNull();
  });

  it('reports a failed load', () => {
    const store = createStore({
      getUserDetail: () => throwError(() => new Error('لم يتم العثور على المستخدم')),
    });

    store.loadUser('missing');

    expect(store.error()).toBe('لم يتم العثور على المستخدم');
  });

  it('shows three favourites until "عرض الكل", then all of them', () => {
    const store = createStore({
      getUserDetail: () => of(buildUserDetail({ favoritePlaces: favoritesOf(7) })),
    });
    store.loadUser('user-1');

    expect(store.visibleFavoriteRows()).toHaveLength(3);
    expect(store.favoritesToggleLabel()).toBe('عرض الكل (7)');

    store.toggleAllFavorites();

    expect(store.visibleFavoriteRows()).toHaveLength(7);
    expect(store.favoritesToggleLabel()).toBe('عرض أقل');
  });

  it('shows two reviews until "عرض الكل", and hides the link when nothing is held back', () => {
    const [review] = buildUserDetail().reviews;
    const store = createStore({
      getUserDetail: () =>
        of(
          buildUserDetail({ reviews: [review, { ...review, id: 'r2' }, { ...review, id: 'r3' }] }),
        ),
    });
    store.loadUser('user-1');

    expect(store.visibleReviewRows()).toHaveLength(2);
    expect(store.reviewsToggleLabel()).toBe('عرض الكل (3)');

    store.toggleAllReviews();
    expect(store.visibleReviewRows()).toHaveLength(3);
  });

  it('offers no "عرض الكل" when every item already shows', () => {
    const store = createStore({ getUserDetail: () => of(buildUserDetail()) });
    store.loadUser('user-1');

    expect(store.favoritesToggleLabel()).toBe('');
    expect(store.reviewsToggleLabel()).toBe('');
  });

  it('collapses the lists again when another user loads', () => {
    const store = createStore({
      getUserDetail: () => of(buildUserDetail({ favoritePlaces: favoritesOf(7) })),
    });
    store.loadUser('user-1');
    store.toggleAllFavorites();

    store.loadUser('user-2');

    expect(store.visibleFavoriteRows()).toHaveLength(3);
  });
});
