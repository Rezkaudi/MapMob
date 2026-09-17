import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PlatformSettingsRepository } from '../../data/platform-settings.repository';
import { buildPlatformSettings } from '../../testing/settings-fixture';
import { PlatformSettingsPage } from './platform-settings';

const SETTINGS = buildPlatformSettings();

function render(overrides: Partial<PlatformSettingsRepository> = {}) {
  const repository: Partial<PlatformSettingsRepository> = {
    getSettings: () => of(SETTINGS),
    updateMap: (map) => of(map),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [{ provide: PlatformSettingsRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(PlatformSettingsPage);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

async function submitMapCard(
  fixture: { whenStable(): Promise<unknown>; detectChanges(): void },
  element: HTMLElement,
) {
  (
    element.querySelector('app-map-settings-card button[type="submit"]') as HTMLButtonElement
  ).click();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('PlatformSettingsPage', () => {
  it('heads the section and stacks the four cards in the design order', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إعدادات المنصة');
    expect(element.textContent).toContain('إدارة الإعدادات العامة على منصة MapMob');
    expect(
      Array.from(element.querySelectorAll('h3')).map((title) => title.textContent?.trim()),
    ).toEqual([
      'معلومات المنصة الأساسية',
      'إعدادات الخرائط والموقع الجغرافي',
      'إعدادات اللغة',
      'إعدادات العملة و الأسعار',
    ]);
  });

  it('confirms a saved card', async () => {
    const { fixture, element } = render();

    await submitMapCard(fixture, element);

    expect(element.querySelector('app-toast')?.textContent).toContain(
      'تم تحديث إعدادات الخرائط والموقع الجغرافي.',
    );
  });

  it('says why a card could not be saved', async () => {
    const { fixture, element } = render({
      updateMap: () => throwError(() => new Error('الخادم لا يستجيب')),
    });

    await submitMapCard(fixture, element);

    const toast = element.querySelector('app-toast');
    expect(toast?.textContent).toContain('تعذر حفظ التغييرات');
    expect(toast?.textContent).toContain('الخادم لا يستجيب');
  });

  it('offers a retry when the settings cannot be loaded', () => {
    const { element } = render({ getSettings: () => throwError(() => new Error('تعذر التحميل')) });

    expect(element.querySelector('app-error-state')?.textContent).toContain('تعذر التحميل');
    expect(element.querySelector('app-settings-card')).toBeNull();
  });
});
