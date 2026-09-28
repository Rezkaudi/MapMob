import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthRepository } from '../../auth/data/auth.repository';
import { AuthStore } from '../../auth/state/auth.store';
import { merchantSignedInGuard } from './merchant-signed-in.guard';

const USER = { id: 'user-1', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

describe('merchantSignedInGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'login', children: [] },
          { path: 'admin/dashboard', children: [] },
          { path: 'merchant/dashboard', canActivate: [merchantSignedInGuard], children: [] },
        ]),
        { provide: AuthRepository, useValue: {} },
      ],
    });
  });

  it('sends a signed-out visitor to the merchant login', async () => {
    await TestBed.inject(Router).navigateByUrl('/merchant/dashboard');

    expect(TestBed.inject(Location).path()).toBe('/login?role=merchant');
  });

  it('sends an admin back to the admin dashboard', async () => {
    TestBed.inject(AuthStore).startSession(USER);

    await TestBed.inject(Router).navigateByUrl('/merchant/dashboard');

    expect(TestBed.inject(Location).path()).toBe('/admin/dashboard');
  });

  it('lets a merchant through', async () => {
    TestBed.inject(AuthStore).startSession({ ...USER, role: 'owner' });

    await TestBed.inject(Router).navigateByUrl('/merchant/dashboard');

    expect(TestBed.inject(Location).path()).toBe('/merchant/dashboard');
  });
});
