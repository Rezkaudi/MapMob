import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SettingsNav } from './settings-nav';

@Component({ template: '' })
class EmptyPage {}

async function renderAt(url: string) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {
          path: 'settings',
          component: SettingsNav,
          children: [{ path: '**', component: EmptyPage }],
        },
      ]),
    ],
  });
  const harness = await RouterTestingHarness.create(url);
  return harness.fixture.nativeElement as HTMLElement;
}

describe('SettingsNav', () => {
  it('links each tab to its settings page, with its label', async () => {
    const element = await renderAt('/settings/account');

    const links = Array.from(element.querySelectorAll('a'));
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/settings/account',
      '/settings/platform',
      '/settings/notifications',
      '/settings/payments',
      '/settings/admins',
      '/settings/roles',
    ]);
    expect(
      links.map((link) => link.querySelector('[data-role="tab-label"]')?.textContent?.trim()),
    ).toEqual([
      'الحساب',
      'إعدادات المنصة',
      'إعدادات الإشعارات',
      'إعدادات الدفع',
      'مشرفوا لوحة التحكم',
      'الأدوار والصلاحيات',
    ]);
  });

  it('marks only the open tab as the current page', async () => {
    const element = await renderAt('/settings/payments');

    const current = element.querySelectorAll('a[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0].getAttribute('href')).toBe('/settings/payments');
  });
});
