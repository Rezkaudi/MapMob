import { TestBed } from '@angular/core/testing';
import { AuthStorage } from './auth-storage';

const USER = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

describe('AuthStorage', () => {
  let storage: AuthStorage;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [AuthStorage] });
    storage = TestBed.inject(AuthStorage);
  });

  it('reads nothing when no user was saved', () => {
    expect(storage.read()).toBeNull();
  });

  it('reads back the user it saved', () => {
    storage.save(USER);

    expect(storage.read()).toEqual(USER);
  });

  it('clear removes the saved user', () => {
    storage.save(USER);

    storage.clear();

    expect(storage.read()).toBeNull();
  });

  it('reads nothing when the saved value is broken', () => {
    storage.save(USER);
    const [key] = Object.keys(localStorage);
    localStorage.setItem(key, 'not json');

    expect(storage.read()).toBeNull();
  });
});
