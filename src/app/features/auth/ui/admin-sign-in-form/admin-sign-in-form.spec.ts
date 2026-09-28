import { TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { AuthRepository } from '../../data/auth.repository';
import { AuthStore } from '../../state/auth.store';
import { AdminSignInForm } from './admin-sign-in-form';

const ADMIN = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

function render(repository: Partial<AuthRepository> = {}) {
  localStorage.clear();
  TestBed.configureTestingModule({
    providers: [{ provide: AuthRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(AdminSignInForm);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  const type = (selector: string, value: string) => {
    const input = element.querySelector<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  const submit = () => {
    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    fixture.detectChanges();
  };
  return { fixture, element, type, submit };
}

describe('AdminSignInForm', () => {
  it('shows the admin copy', () => {
    const { element } = render();

    expect(element.querySelector('h1')!.textContent!.trim()).toBe('أهلاً بعودتك');
    expect(element.textContent).toContain('سجّل الدخول إلى لوحة التحكم');
    expect(
      [...element.querySelectorAll('label')].map((label) => label.textContent!.trim()),
    ).toEqual(['البريد الالكتروني', 'كلمة المرور']);
  });

  it('does not offer a forgotten-password link, as admins have no reset flow', () => {
    const { element } = render();

    expect(element.textContent).not.toContain('نسيت كلمة المرور؟');
  });

  it('signs the admin in through the shared session', () => {
    const { type, submit } = render({ signIn: () => of(ADMIN) });

    type('#email', 'admin@admin.com');
    type('#password', 'admin');
    submit();

    expect(TestBed.inject(AuthStore).isSignedIn()).toBe(true);
  });

  it('says what is missing instead of calling the API', () => {
    let calls = 0;
    const { element, submit } = render({
      signIn: () => {
        calls++;
        return NEVER;
      },
    });

    submit();

    expect(calls).toBe(0);
    expect(element.querySelector('[role="alert"]')!.textContent!.trim()).toBe(
      'أدخل البريد الإلكتروني وكلمة المرور',
    );
  });

  it('shows the error from the API', () => {
    const { element, type, submit } = render({
      signIn: () => throwError(() => new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة')),
    });

    type('#email', 'admin@admin.com');
    type('#password', 'wrong');
    submit();

    expect(element.querySelector('[role="alert"]')!.textContent!.trim()).toBe(
      'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    );
  });

  it('spins inside the submit button while signing in', () => {
    const { element, type, submit } = render({ signIn: () => NEVER });

    type('#email', 'admin@admin.com');
    type('#password', 'admin');
    submit();

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(button.disabled).toBe(true);
    expect(button.querySelector('app-spinner')).toBeTruthy();
  });
});
