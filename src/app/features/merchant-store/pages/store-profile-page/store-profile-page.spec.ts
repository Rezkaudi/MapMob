import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { MERCHANT_SUPPORT_URL } from '../../../../core/config/merchant-support-url';
import { StoreProfileRepository } from '../../data/store-profile.repository';
import { StoreProfile } from '../../models/store-profile';
import { StoreProfileUpdate } from '../../models/store-profile-update';
import { buildStoreProfile } from '../../testing/store-profile-fixture';
import { StoreProfilePage } from './store-profile-page';

interface FakeRepository {
  getProfile: () => Observable<StoreProfile>;
  saveProfile: (update: StoreProfileUpdate) => Observable<StoreProfile>;
}

function render(repository: Partial<FakeRepository> = {}) {
  const saveProfile = vi.fn(
    repository.saveProfile ??
      ((update: StoreProfileUpdate) => of(buildStoreProfile({ name: update.name }))),
  );
  TestBed.configureTestingModule({
    providers: [
      {
        provide: StoreProfileRepository,
        useValue: {
          getProfile: repository.getProfile ?? (() => of(buildStoreProfile())),
          saveProfile,
        },
      },
      { provide: MERCHANT_SUPPORT_URL, useValue: 'mailto:support@mapmob.sy' },
    ],
  });
  const fixture = TestBed.createComponent(StoreProfilePage);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  const saveButton = () => element.querySelector('[data-role="save"]') as HTMLButtonElement;
  const type = (selector: string, value: string) => {
    const input = element.querySelector(selector) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  return { fixture, element, saveProfile, saveButton, type };
}

describe('StoreProfilePage', () => {
  it('heads the page with its title, its line and the save button', () => {
    const { element, saveButton } = render();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('بيانات المتجر');
    expect(element.textContent).toContain('حدث معلومات المتجر لتعزيز ظهورك المحلي.');
    expect(saveButton().textContent?.trim()).toBe('حفظ التغييرات');
  });

  it('puts the main column first, so RTL draws it on the right of the map and hours', () => {
    const { element } = render();
    const columns = [...element.querySelectorAll('[data-role="column"]')];

    expect(
      columns.map((column) => [...column.children].map((card) => card.tagName.toLowerCase())),
    ).toEqual([
      [
        'app-store-basic-info-card',
        'app-store-classification-card',
        'app-store-contact-card',
        'app-store-delivery-card',
      ],
      ['app-store-location-card', 'app-store-hours-card'],
    ]);
  });

  it('fills every card from the saved place', () => {
    const { element } = render();

    expect((element.querySelector('#store-name') as HTMLInputElement).value).toBe('صيدلية الحياة');
    expect((element.querySelector('#store-phone') as HTMLInputElement).value).toBe(
      '+963 944 123 456',
    );
    expect((element.querySelector('#store-address') as HTMLInputElement).value).toContain(
      'شارع الثورة',
    );
    expect(element.querySelector('[data-role="counter"]')?.textContent?.trim()).toBe('300/39');
    expect(element.querySelectorAll('app-store-hours-card li')).toHaveLength(7);
    expect(element.querySelectorAll('app-delivery-platform-item')).toHaveLength(2);
    expect((element.querySelector('#delivery-link-1') as HTMLInputElement).value).toBe(
      'https://beeorder.sy/store/alhayat-pharma',
    );
  });

  it('keeps the counter and the map card in step with typing', () => {
    const { element, type } = render();

    type('#store-description', 'صيدلية');
    type('#store-address', 'شارع هنانو');

    expect(element.querySelector('[data-role="counter"]')?.textContent?.trim()).toBe('300/6');
    expect(element.querySelector('[data-role="map-summary"]')?.textContent).toContain(
      'طرطوس، شارع هنانو',
    );
  });

  it('offers a retry when the place cannot be loaded', () => {
    const { element } = render({
      getProfile: () => throwError(() => new Error('تعذر تحميل المتجر')),
    });

    expect(element.querySelector('app-error-state')?.textContent).toContain('تعذر تحميل المتجر');
    expect(element.querySelector('app-store-basic-info-card')).toBeNull();
  });

  it('shows what is missing instead of saving an incomplete form', () => {
    const { fixture, element, saveProfile, saveButton, type } = render();

    type('#store-name', '');
    saveButton().click();
    fixture.detectChanges();

    expect(saveProfile).not.toHaveBeenCalled();
    expect(
      element.querySelector('app-store-basic-info-card [role="alert"]')?.textContent?.trim(),
    ).toBe('أدخل اسم المتجر');
    expect(document.activeElement?.id).toBe('store-name');
  });

  it('asks for the link of a platform switched on without one, instead of saving', () => {
    const { fixture, element, saveProfile, saveButton } = render();
    const talabatSwitch = element.querySelectorAll<HTMLButtonElement>(
      'app-store-delivery-card [role="switch"]',
    )[1];

    talabatSwitch.click();
    fixture.detectChanges();
    (document.activeElement as HTMLElement | null)?.blur();
    saveButton().click();
    fixture.detectChanges();

    expect(saveProfile).not.toHaveBeenCalled();
    expect(
      element.querySelector('app-store-delivery-card [role="alert"]')?.textContent?.trim(),
    ).toBe('أدخل رابط متجرك على المنصة');
    expect(document.activeElement?.id).toBe('delivery-link-3');
  });

  it('saves the platforms switched off and on with their links', () => {
    const { fixture, element, saveProfile, saveButton, type } = render();
    const switches = element.querySelectorAll<HTMLButtonElement>(
      'app-store-delivery-card [role="switch"]',
    );

    switches[0].click();
    switches[1].click();
    fixture.detectChanges();
    type('#delivery-link-3', 'https://talabat.com/syria/alhayat');
    saveButton().click();
    fixture.detectChanges();

    expect(saveProfile.mock.calls[0][0].deliveryLinks).toEqual([
      { platformId: '1', isEnabled: false, storeUrl: 'https://beeorder.sy/store/alhayat-pharma' },
      { platformId: '3', isEnabled: true, storeUrl: 'https://talabat.com/syria/alhayat' },
    ]);
  });

  it('saves the edited fields and week, then says so', () => {
    const { fixture, element, saveProfile, saveButton, type } = render();

    type('#store-name', 'صيدلية الشفاء');
    (element.querySelectorAll('app-store-hours-card li > button')[1] as HTMLButtonElement).click();
    (element.querySelector('app-store-hours-card [role="switch"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    saveButton().click();
    fixture.detectChanges();

    const update = saveProfile.mock.calls[0][0];
    expect(update.name).toBe('صيدلية الشفاء');
    expect(update.isOpen24Hours).toBe(true);
    expect(update.workingHours[1]).toEqual({
      day: 'sunday',
      isOpen: false,
      openTime: null,
      closeTime: null,
    });
    expect(update.cover).toBeNull();
    expect(element.querySelector('app-toast')?.textContent).toContain('تم حفظ التغييرات');
  });

  it('keeps the edits and reports a failed save', () => {
    const { fixture, element, saveButton, type } = render({
      saveProfile: () => throwError(() => new Error('الشبكة غير متاحة')),
    });

    type('#store-name', 'صيدلية الشفاء');
    saveButton().click();
    fixture.detectChanges();

    expect(element.querySelector('app-toast')?.textContent).toContain('الشبكة غير متاحة');
    expect((element.querySelector('#store-name') as HTMLInputElement).value).toBe('صيدلية الشفاء');
  });
});
