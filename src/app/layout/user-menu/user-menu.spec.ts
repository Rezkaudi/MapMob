import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthRepository } from '../../features/auth/data/auth.repository';
import { AuthStore } from '../../features/auth/state/auth.store';
import { UserMenu } from './user-menu';

const USER = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

@Component({
  imports: [UserMenu],
  template: `<app-user-menu userName="أحمد" userRole="Admin" />`,
})
class HostComponent {}

function trigger(fixture: { nativeElement: HTMLElement }): HTMLButtonElement {
  return fixture.nativeElement.querySelector('button[aria-haspopup="menu"]')!;
}

function menu(fixture: { nativeElement: HTMLElement }): HTMLElement | null {
  return fixture.nativeElement.querySelector('[role="menu"]');
}

describe('UserMenu', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthRepository, useValue: { signIn: () => of(USER) } },
      ],
    });
  });

  it('shows the signed-in name and role on the trigger', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = trigger(fixture).textContent!;
    expect(text).toContain('أحمد');
    expect(text).toContain('Admin');
  });

  it('starts closed', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(menu(fixture)).toBeNull();
    expect(trigger(fixture).getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the menu when the trigger is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    trigger(fixture).click();
    fixture.detectChanges();

    expect(trigger(fixture).getAttribute('aria-expanded')).toBe('true');
    const text = menu(fixture)!.textContent!;
    expect(text).toContain('الملف الشخصي');
    expect(text).toContain('الإعدادات');
    expect(text).toContain('تسجيل الخروج');
  });

  it('closes again on a second trigger click', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    trigger(fixture).click();
    fixture.detectChanges();
    trigger(fixture).click();
    fixture.detectChanges();

    expect(menu(fixture)).toBeNull();
  });

  it('closes when the user clicks outside it', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    trigger(fixture).click();
    fixture.detectChanges();

    document.body.click();
    fixture.detectChanges();

    expect(menu(fixture)).toBeNull();
  });

  it('closes on Escape', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    trigger(fixture).click();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(menu(fixture)).toBeNull();
  });

  it('signs the user out and sends them to the login page', () => {
    const fixture = TestBed.createComponent(HostComponent);
    const store = TestBed.inject(AuthStore);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    store.signIn({ email: 'a@b.com', password: '12345678' });
    fixture.detectChanges();
    expect(store.isSignedIn()).toBe(true);

    trigger(fixture).click();
    fixture.detectChanges();
    const items: HTMLElement[] = Array.from(menu(fixture)!.querySelectorAll('[role="menuitem"]'));
    items.find((item) => item.textContent?.trim() === 'تسجيل الخروج')!.click();
    fixture.detectChanges();

    expect(store.isSignedIn()).toBe(false);
    expect(navigate).toHaveBeenCalledWith('/login');
    expect(menu(fixture)).toBeNull();
  });
});
