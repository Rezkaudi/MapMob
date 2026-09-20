import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthRepository } from '../../features/auth/data/auth.repository';
import { TopBar } from './top-bar';

const USER = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 'token' };

@Component({
  imports: [TopBar],
  template: `<app-top-bar
    userName="أحمد"
    userRole="Admin"
    [unreadNotificationCount]="unreadNotificationCount()"
  />`,
})
class HostComponent {
  readonly unreadNotificationCount = signal(0);
}

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

  it('lines the header up with the page padding below it', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const header: HTMLElement = fixture.nativeElement.querySelector('header')!;
    const cluster: HTMLElement = fixture.nativeElement.querySelector('header > div')!;
    expect(header.className).toContain('ps-8');
    expect(header.className).toContain('pe-[calc(2rem+var(--scroll-gutter,0px))]');
    expect(cluster.className).not.toContain('min-w-');
  });

  it('renders a search field', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
  });

  it('sends the bell to the inbox page', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const bell: HTMLAnchorElement = fixture.nativeElement.querySelector('a[data-role="inbox"]');
    expect(bell.getAttribute('href')).toBe('/inbox');
    expect(bell.getAttribute('aria-label')).toBe('الإشعارات الواردة');
  });

  it('draws the red dot only while something is unread', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const bellSource = () =>
      fixture.nativeElement.querySelector('a[data-role="inbox"] img').getAttribute('src');
    expect(bellSource()).toBe('assets/icons/bell.svg');

    fixture.componentInstance.unreadNotificationCount.set(3);
    fixture.detectChanges();

    expect(bellSource()).toBe('assets/icons/notification.svg');
    expect(
      fixture.nativeElement.querySelector('a[data-role="inbox"]').getAttribute('aria-label'),
    ).toBe('الإشعارات الواردة (3 غير مقروءة)');
  });

  it('offers the user menu', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button[aria-haspopup="menu"]')).toBeTruthy();
  });

  it('stacks above the page so the open user menu is not covered', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const header: HTMLElement = fixture.nativeElement.querySelector('header');
    expect(header.classList.contains('relative')).toBe(true);
    expect(header.classList.contains('z-30')).toBe(true);
  });
});
