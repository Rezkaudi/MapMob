import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthRepository } from '../../features/auth/data/auth.repository';
import { AuthStore } from '../../features/auth/state/auth.store';
import { MerchantShell } from './merchant-shell';

const MERCHANT = { id: 'm-1', name: 'أحمد', role: 'owner', avatarUrl: null, token: 't' };

describe('MerchantShell', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthRepository, useValue: {} }],
    });
    TestBed.inject(AuthStore).startSession(MERCHANT);
  });

  it('draws the merchant sidebar, not the admin one', () => {
    const fixture = TestBed.createComponent(MerchantShell);
    fixture.detectChanges();

    const text = fixture.nativeElement.querySelector('app-sidebar').textContent;
    expect(text).toContain('بيانات المتجر');
    expect(text).toContain('الصور والوسائط');
    expect(text).not.toContain('المستخدمون');
  });

  it('shows the merchant name without a role line, as the frame draws it', () => {
    const fixture = TestBed.createComponent(MerchantShell);
    fixture.detectChanges();

    const names: HTMLElement = fixture.nativeElement.querySelector(
      'app-user-menu button span.flex-col',
    );
    expect(names.textContent!.trim()).toBe('أحمد');
  });

  it('sends the bell to the merchant notifications', () => {
    const fixture = TestBed.createComponent(MerchantShell);
    fixture.detectChanges();

    const bell: HTMLAnchorElement = fixture.nativeElement.querySelector('a[data-role="inbox"]');
    expect(bell.getAttribute('href')).toBe('/merchant/notifications');
  });

  it('keeps room for the scrollbar like the admin shell, and renders a router outlet', () => {
    const fixture = TestBed.createComponent(MerchantShell);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('main').className).toContain(
      '[scrollbar-gutter:stable]',
    );
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
