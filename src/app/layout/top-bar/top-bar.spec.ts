import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthRepository } from '../../features/auth/data/auth.repository';
import { TopBar } from './top-bar';

const USER = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

@Component({ imports: [TopBar], template: `<app-top-bar userName="أحمد" userRole="Admin" />` })
class HostComponent {}

describe('TopBar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthRepository, useValue: { signIn: () => of(USER) } },
      ],
    });
  });

  it('shows the signed-in user name and role', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('أحمد');
    expect(text).toContain('Admin');
  });

  it('renders a search field', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
  });

  it('draws the bell from its multi-colour asset, dot included', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const bell: HTMLImageElement = fixture.nativeElement.querySelector(
      'img[src="assets/icons/notification.svg"]',
    );
    expect(bell).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.bg-error')).toBeNull();
  });

  it('offers the user menu', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button[aria-haspopup="menu"]')).toBeTruthy();
  });
});
