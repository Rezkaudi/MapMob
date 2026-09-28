import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { MERCHANT_SUPPORT_URL } from '../../../../core/config/merchant-support-url';
import { MerchantAuthRepository } from '../../../merchant-auth/data/merchant-auth.repository';
import { AuthRepository } from '../../data/auth.repository';
import { AuthStore } from '../../state/auth.store';
import { Login } from './login';

const ADMIN = { id: 'user-admin', name: 'أحمد', role: 'Admin', avatarUrl: null, token: 't' };
const MERCHANT = { ...ADMIN, id: 'm-1', role: 'owner' };

async function open(url: string) {
  localStorage.clear();
  TestBed.configureTestingModule({
    providers: [
      provideRouter(
        [
          { path: 'login', component: Login },
          { path: 'admin/dashboard', children: [] },
          { path: 'merchant/dashboard', children: [] },
        ],
        withComponentInputBinding(),
      ),
      { provide: AuthRepository, useValue: { signIn: () => of(ADMIN) } },
      { provide: MerchantAuthRepository, useValue: { signIn: () => of(MERCHANT) } },
      { provide: MERCHANT_SUPPORT_URL, useValue: 'mailto:help@example.com' },
    ],
  });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(url);
  const element = harness.fixture.nativeElement as HTMLElement;
  return {
    harness,
    element,
    path: () => TestBed.inject(Location).path(),
    tab: (label: string) =>
      [...element.querySelectorAll<HTMLButtonElement>('[role="radio"]')].find(
        (button) => button.textContent!.trim() === label,
      )!,
  };
}

async function signIn(page: Awaited<ReturnType<typeof open>>, email: string) {
  const type = (selector: string, value: string) => {
    const input = page.element.querySelector<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  type('#email', email);
  type('#password', 'secret');
  page.element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
  await page.harness.fixture.whenStable();
}

describe('Login', () => {
  it('opens the admin tab on a bare /login', async () => {
    const page = await open('/login');

    expect(page.tab('حساب الإدارة').getAttribute('aria-checked')).toBe('true');
    expect(page.element.querySelector('app-admin-sign-in-form')).toBeTruthy();
    expect(page.element.querySelector('app-merchant-sign-in-form')).toBeNull();
  });

  it('opens the merchant tab from ?role=merchant', async () => {
    const page = await open('/login?role=merchant');

    expect(page.tab('حساب المتجر').getAttribute('aria-checked')).toBe('true');
    expect(page.element.querySelector('app-merchant-sign-in-form')).toBeTruthy();
  });

  it('puts the tab in the URL, so a reload or a shared link keeps it', async () => {
    const page = await open('/login');

    page.tab('حساب المتجر').click();
    await page.harness.fixture.whenStable();
    page.harness.detectChanges();

    expect(page.path()).toBe('/login?role=merchant');
    expect(page.element.querySelector('app-merchant-sign-in-form')).toBeTruthy();
  });

  it('draws the tabs above the heading, in the 382px form column', async () => {
    const page = await open('/login');

    const tabs = page.element.querySelector('app-segmented-choice')!;
    expect(tabs.nextElementSibling!.tagName).toBe('APP-ADMIN-SIGN-IN-FORM');
  });

  it('opens the admin dashboard once an admin signs in', async () => {
    const page = await open('/login');

    await signIn(page, 'admin@admin.com');

    expect(page.path()).toBe('/admin/dashboard');
  });

  it('opens the merchant dashboard once a merchant signs in', async () => {
    const page = await open('/login?role=merchant');

    await signIn(page, 'merchant@merchant.com');

    expect(page.path()).toBe('/merchant/dashboard');
  });

  it('sends a merchant who is already signed in straight to their dashboard', async () => {
    localStorage.clear();
    localStorage.setItem('mapmob.auth.user', JSON.stringify(MERCHANT));
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [
            { path: 'login', component: Login },
            { path: 'merchant/dashboard', children: [] },
          ],
          withComponentInputBinding(),
        ),
        { provide: AuthRepository, useValue: {} },
        { provide: MerchantAuthRepository, useValue: {} },
        { provide: MERCHANT_SUPPORT_URL, useValue: 'mailto:help@example.com' },
      ],
    });
    TestBed.inject(AuthStore);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/login');
    await harness.fixture.whenStable();

    expect(TestBed.inject(Location).path()).toBe('/merchant/dashboard');
  });

  it('keeps one height for both tabs, so the tabs do not jump when switched', async () => {
    const page = await open('/login');

    const column = page.element.querySelector('app-segmented-choice')!.parentElement!;
    expect(column.classList).toContain('min-h-[607px]');
  });

  it('writes ?role=admin into a bare /login, since admin is the default tab', async () => {
    const page = await open('/login');
    await page.harness.fixture.whenStable();

    expect(page.path()).toBe('/login?role=admin');
    expect(page.tab('حساب الإدارة').getAttribute('aria-checked')).toBe('true');
  });

  it('treats an unknown role as the admin tab and says so in the URL', async () => {
    const page = await open('/login?role=owner');
    await page.harness.fixture.whenStable();

    expect(page.path()).toBe('/login?role=admin');
    expect(page.element.querySelector('app-admin-sign-in-form')).toBeTruthy();
  });

  it('writes ?role=admin when the admin tab is picked', async () => {
    const page = await open('/login?role=merchant');

    page.tab('حساب الإدارة').click();
    await page.harness.fixture.whenStable();

    expect(page.path()).toBe('/login?role=admin');
  });
});
