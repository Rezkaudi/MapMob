import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SettingsLayout } from './settings-layout';

@Component({ selector: 'app-fake-section', template: 'قسم' })
class FakeSection {}

describe('SettingsLayout', () => {
  async function render() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'settings',
            component: SettingsLayout,
            children: [{ path: 'account', component: FakeSection }],
          },
        ]),
      ],
    });
    const harness = await RouterTestingHarness.create('/settings/account');
    return harness.fixture.nativeElement as HTMLElement;
  }

  it('heads the page with the settings title and description', async () => {
    const element = await render();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('الإعدادات');
    expect(element.querySelector('app-page-header p')?.textContent?.trim()).toBe(
      'إدارة إعدادات المنصة.',
    );
  });

  it('puts the tabs first, so they sit on the right, and the open section beside them', async () => {
    const element = await render();

    const columns = element.querySelector('[data-role="settings-columns"]')?.children;
    expect(columns?.[0].tagName.toLowerCase()).toBe('app-settings-nav');
    expect(columns?.[1].querySelector('app-fake-section')?.textContent).toBe('قسم');
  });
});
