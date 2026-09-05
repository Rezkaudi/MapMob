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

  it('keeps the scrolling inside main so the page cannot be dragged past the app', () => {
    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const shell = el.querySelector('div') as HTMLElement;
    expect(shell.className).toContain('overflow-hidden');
    // Without min-h-0 the column refuses to shrink and main stops clipping.
    expect(el.querySelector('main')?.parentElement?.className).toContain('min-h-0');
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
  it('carries the route progress bar for lazy pages', () => {
    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-route-progress')).toBeTruthy();
  });
});
