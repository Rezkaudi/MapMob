import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
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

  it('toggles the password field between hidden and visible', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    const passwordInput = () =>
      fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    expect(passwordInput().type).toBe('password');

    fixture.debugElement.query(By.css('button[aria-label]')).nativeElement.click();
    fixture.detectChanges();

    expect(passwordInput().type).toBe('text');
  });
});
