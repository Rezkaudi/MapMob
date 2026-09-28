import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthRepository } from '../../auth/data/auth.repository';
import { MerchantAuthRepository } from '../data/merchant-auth.repository';
import { MerchantAuthStore } from '../state/merchant-auth.store';
import { resetCodeStepGuard, newPasswordStepGuard } from './password-reset-step.guard';

describe('password reset step guards', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'merchant/forgot-password', children: [] },
          { path: 'merchant/reset-code', canActivate: [resetCodeStepGuard], children: [] },
          { path: 'merchant/new-password', canActivate: [newPasswordStepGuard], children: [] },
        ]),
        { provide: AuthRepository, useValue: {} },
        {
          provide: MerchantAuthRepository,
          useValue: {
            sendResetCode: () => of(undefined),
            verifyResetCode: () => of({ resetToken: 'reset-1' }),
          },
        },
      ],
    });
  });

  it('sends a visitor without a sent code back to the email step', async () => {
    await TestBed.inject(Router).navigateByUrl('/merchant/reset-code');

    expect(TestBed.inject(Location).path()).toBe('/merchant/forgot-password');
  });

  it('opens the code step once a code was sent', async () => {
    TestBed.inject(MerchantAuthStore).sendResetCode('merchant@mapmob.com');

    await TestBed.inject(Router).navigateByUrl('/merchant/reset-code');

    expect(TestBed.inject(Location).path()).toBe('/merchant/reset-code');
  });

  it('keeps the new-password step closed until the code was checked', async () => {
    TestBed.inject(MerchantAuthStore).sendResetCode('merchant@mapmob.com');

    await TestBed.inject(Router).navigateByUrl('/merchant/new-password');

    expect(TestBed.inject(Location).path()).toBe('/merchant/forgot-password');
  });

  it('opens the new-password step with a reset token', async () => {
    const store = TestBed.inject(MerchantAuthStore);
    store.sendResetCode('merchant@mapmob.com');
    store.verifyResetCode('123456');

    await TestBed.inject(Router).navigateByUrl('/merchant/new-password');

    expect(TestBed.inject(Location).path()).toBe('/merchant/new-password');
  });
});
