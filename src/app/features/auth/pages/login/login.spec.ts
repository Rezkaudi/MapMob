import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, of } from 'rxjs';
import { AuthRepository } from '../../data/auth.repository';
import { Login } from './login';

const USER = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

describe('Login', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthRepository, useValue: { signIn: () => of(USER) } },
      ],
    });
  });

  it('renders the brand panel and the sign-in copy from the design', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('MapMob');
    expect(text).toContain('منصة متكاملة لإدارة الأماكن والخدمات والمستخدمين');
    expect(text).toContain('أهلاً بعودتك');
    expect(text).toContain('البريد الالكتروني');
    expect(text).toContain('كلمة المرور');
    expect(text).toContain('نسيت كلمة المرور؟');
    expect(text).toContain('تسجيل دخول');
  });

  it('puts the eye toggle after the password input, so it lands on the left in RTL', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    const field: HTMLElement = fixture.nativeElement.querySelector('#password').parentElement;
    const children = Array.from(field.children);
    expect(children.findIndex((child) => child.id === 'password')).toBeLessThan(
      children.findIndex((child) => child.tagName === 'BUTTON'),
    );
  });

  it('toggles the password field between hidden and visible', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    const passwordInput = () =>
      fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    expect(passwordInput().type).toBe('password');

    fixture.nativeElement.querySelector('#password ~ button').click();
    fixture.detectChanges();

    expect(passwordInput().type).toBe('text');
  });
});

describe('Login while signing in', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthRepository, useValue: { signIn: () => NEVER } },
      ],
    });
  });

  it('spins inside the submit button and blocks a second submit', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    const email: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const password: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    email.value = 'admin@mapmob.com';
    email.dispatchEvent(new Event('input'));
    password.value = '12345678';
    password.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    submit.click();
    fixture.detectChanges();

    expect(submit.disabled).toBe(true);
    expect(submit.getAttribute('aria-busy')).toBe('true');
    expect(submit.querySelector('app-spinner')).toBeTruthy();
  });
});
