import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthRepository } from '../../features/auth/data/auth.repository';
import { AuthStorage } from '../../features/auth/data/auth-storage';
import { AuthStore } from '../../features/auth/state/auth.store';
import { AdminShell } from './admin-shell';

const USER = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

describe('AdminShell', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthRepository, useValue: { signIn: () => of(USER) } },
      ],
    });
  });

  it('renders the sidebar, top bar and a router outlet', () => {
    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-sidebar')).toBeTruthy();
    expect(el.querySelector('app-top-bar')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });

  it('shows the signed-in user in the top bar', () => {
    TestBed.inject(AuthStorage).save({ ...USER, name: 'سارة', role: 'Editor' });
    TestBed.inject(AuthStore);

    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('سارة');
    expect(el.textContent).toContain('Editor');
  });
});
