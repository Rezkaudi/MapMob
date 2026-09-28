import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthRepository } from '../../auth/data/auth.repository';
import { AuthStore } from '../../auth/state/auth.store';
import { MerchantAuthRepository } from '../data/merchant-auth.repository';
import { MerchantAuthStore } from './merchant-auth.store';

const MERCHANT = {
  id: 'merchant-1',
  name: 'أحمد',
  role: 'owner',
  avatarUrl: null,
  token: 'token',
};
const EMAIL = 'merchant@mapmob.com';

function createStore(repository: Partial<MerchantAuthRepository>) {
  TestBed.configureTestingModule({
    providers: [
      { provide: MerchantAuthRepository, useValue: repository },
      { provide: AuthRepository, useValue: {} },
    ],
  });
  return TestBed.inject(MerchantAuthStore);
}

describe('MerchantAuthStore', () => {
  beforeEach(() => localStorage.clear());

  it('signs a merchant in through the shared session', () => {
    const store = createStore({ signIn: () => of(MERCHANT) });

    store.signIn({ email: EMAIL, password: 'merchant' });

    expect(TestBed.inject(AuthStore).isMerchant()).toBe(true);
    expect(store.isLoading()).toBe(false);
  });

  it('reports a failed sign-in', () => {
    const store = createStore({ signIn: () => throwError(() => new Error('خطأ')) });

    store.signIn({ email: EMAIL, password: 'wrong' });

    expect(store.error()).toBe('خطأ');
    expect(TestBed.inject(AuthStore).isSignedIn()).toBe(false);
  });

  it('moves to the code step once the code is sent, and remembers the email', () => {
    const store = createStore({ sendResetCode: () => of(undefined) });

    store.sendResetCode(EMAIL);

    expect(store.resetStep()).toBe('code');
    expect(store.resetEmail()).toBe(EMAIL);
  });

  it('resends the code to the remembered email', () => {
    const sentTo: string[] = [];
    const store = createStore({
      sendResetCode: (email: string) => {
        sentTo.push(email);
        return of(undefined);
      },
    });
    store.sendResetCode(EMAIL);

    store.resendResetCode();

    expect(sentTo).toEqual([EMAIL, EMAIL]);
    expect(store.resetStep()).toBe('code');
  });

  it('moves to the password step with a reset token once the code checks out', () => {
    const store = createStore({
      sendResetCode: () => of(undefined),
      verifyResetCode: () => of({ resetToken: 'reset-1' }),
    });
    store.sendResetCode(EMAIL);

    store.verifyResetCode('123456');

    expect(store.resetStep()).toBe('password');
    expect(store.resetToken()).toBe('reset-1');
  });

  it('stays on the code step and shows the error when the code is wrong', () => {
    const store = createStore({
      sendResetCode: () => of(undefined),
      verifyResetCode: () => throwError(() => new Error('رمز التحقق غير صحيح')),
    });
    store.sendResetCode(EMAIL);

    store.verifyResetCode('000000');

    expect(store.resetStep()).toBe('code');
    expect(store.error()).toBe('رمز التحقق غير صحيح');
  });

  it('finishes the reset and forgets the token once the password is saved', () => {
    const store = createStore({
      sendResetCode: () => of(undefined),
      verifyResetCode: () => of({ resetToken: 'reset-1' }),
      resetPassword: () => of(undefined),
    });
    store.sendResetCode(EMAIL);
    store.verifyResetCode('123456');

    store.resetPassword('new-secret-1');

    expect(store.resetStep()).toBe('done');
    expect(store.resetToken()).toBeNull();
  });

  it('starts a fresh reset from the email step', () => {
    const store = createStore({ sendResetCode: () => of(undefined) });
    store.sendResetCode(EMAIL);

    store.startReset();

    expect(store.resetStep()).toBe('email');
    expect(store.resetEmail()).toBeNull();
    expect(store.error()).toBeNull();
  });

  it('clears an old error but keeps the reset step', () => {
    const store = createStore({
      sendResetCode: () => of(undefined),
      verifyResetCode: () => throwError(() => new Error('رمز التحقق غير صحيح')),
    });
    store.sendResetCode(EMAIL);
    store.verifyResetCode('000000');

    store.clearError();

    expect(store.error()).toBeNull();
    expect(store.resetStep()).toBe('code');
  });
});
