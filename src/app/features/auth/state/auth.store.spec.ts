import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthRepository } from '../data/auth.repository';
import { AuthStorage } from '../data/auth-storage';
import { AuthStore } from './auth.store';

const USER = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

function createStore(repository: Partial<AuthRepository>) {
  TestBed.configureTestingModule({
    providers: [AuthStore, { provide: AuthRepository, useValue: repository }],
  });
  return TestBed.inject(AuthStore);
}

describe('AuthStore', () => {
  beforeEach(() => localStorage.clear());

  it('starts signed out', () => {
    const store = createStore({});

    expect(store.user()).toBeNull();
    expect(store.isSignedIn()).toBe(false);
  });

  it('signIn stores the authenticated user', () => {
    const store = createStore({ signIn: () => of(USER) });

    store.signIn({ email: 'admin@mapmob.com', password: '12345678' });

    expect(store.user()).toEqual(USER);
    expect(store.isSignedIn()).toBe(true);
    expect(store.isLoading()).toBe(false);
  });

  it('keeps the user signed out and reports the error when sign-in fails', () => {
    const store = createStore({ signIn: () => throwError(() => new Error('بيانات غير صحيحة')) });

    store.signIn({ email: 'a@b.com', password: 'wrong' });

    expect(store.isSignedIn()).toBe(false);
    expect(store.error()).toBe('بيانات غير صحيحة');
  });

  it('signOut clears the user', () => {
    const store = createStore({ signIn: () => of(USER) });
    store.signIn({ email: 'admin@mapmob.com', password: '12345678' });

    store.signOut();

    expect(store.user()).toBeNull();
    expect(store.isSignedIn()).toBe(false);
  });

  it('signIn saves the user so a reload keeps the session', () => {
    const store = createStore({ signIn: () => of(USER) });

    store.signIn({ email: 'admin@admin.com', password: 'admin' });

    expect(TestBed.inject(AuthStorage).read()).toEqual(USER);
  });

  it('signOut removes the saved user', () => {
    const store = createStore({ signIn: () => of(USER) });
    store.signIn({ email: 'admin@admin.com', password: 'admin' });

    store.signOut();

    expect(TestBed.inject(AuthStorage).read()).toBeNull();
  });

  it('starts signed in when a user was saved before', () => {
    TestBed.configureTestingModule({
      providers: [AuthStorage, { provide: AuthRepository, useValue: {} }],
    });
    TestBed.inject(AuthStorage).save(USER);

    const store = TestBed.inject(AuthStore);

    expect(store.user()).toEqual(USER);
    expect(store.isSignedIn()).toBe(true);
  });
});
