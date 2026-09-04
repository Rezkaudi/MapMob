import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthRepository } from '../../features/auth/data/auth.repository';
import { AdminShell } from './admin-shell';

const USER = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

describe('AdminShell', () => {
  beforeEach(() => {
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
});
