import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthRepository } from '../data/auth.repository';
import { AuthStore } from '../state/auth.store';
import { signedInGuard } from './signed-in.guard';

const USER = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

describe('signedInGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'login', children: [] },
          { path: 'merchant/dashboard', children: [] },
          { path: 'admin/dashboard', canActivate: [signedInGuard], children: [] },
        ]),
        { provide: AuthRepository, useValue: { signIn: () => of(USER) } },
      ],
    });
  });

  it('sends a signed-out visitor to the login page', async () => {
    await TestBed.inject(Router).navigateByUrl('/admin/dashboard');

    expect(TestBed.inject(Location).path()).toBe('/login?role=admin');
  });

  it('lets a signed-in user through', async () => {
    TestBed.inject(AuthStore).signIn({ email: 'admin@admin.com', password: 'admin' });

    await TestBed.inject(Router).navigateByUrl('/admin/dashboard');

    expect(TestBed.inject(Location).path()).toBe('/admin/dashboard');
  });

  it('sends a signed-in merchant to the merchant dashboard instead', async () => {
    TestBed.inject(AuthStore).startSession({ ...USER, role: 'owner' });

    await TestBed.inject(Router).navigateByUrl('/admin/dashboard');

    expect(TestBed.inject(Location).path()).toBe('/merchant/dashboard');
  });
});
