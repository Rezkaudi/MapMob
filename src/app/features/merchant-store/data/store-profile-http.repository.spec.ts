import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { toStoreProfileFormValue, toStoreProfileUpdate } from '../state/store-profile-form-mapping';
import { buildStoreProfile } from '../testing/store-profile-fixture';
import { LiveOwnerStore } from './live-owner-store';
import { StoreProfileHttpRepository } from './store-profile-http.repository';

const LIVE_STORE: LiveOwnerStore = {
  name: { ar: 'صيدلية الحياة' },
  description: [],
  publicUrl: 'https://api.mapmob.com.co/store/alhayat',
  coverImageUrl: null,
  contact: { phone: '0931', whatsapp: null, email: null, website: null },
  mainCategory: { id: '1', name: 'صيدليات' },
  subCategory: null,
  region: { id: '1', name: 'دمشق' },
  city: { id: '2', name: 'داريا' },
  address: { ar: 'شارع الثورة' },
  latitude: 33.5,
  longitude: 36.3,
  workingHours: [],
  socialLinks: [],
  deliveryLinks: [],
};

describe('StoreProfileHttpRepository', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoreProfileHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
  });

  it("reads the signed-in owner's place", async () => {
    const response = firstValueFrom(TestBed.inject(StoreProfileHttpRepository).getProfile());

    const request = TestBed.inject(HttpTestingController).expectOne('https://api.test/owner/store');
    expect(request.request.method).toBe('GET');
    request.flush({ data: LIVE_STORE });
    expect((await response).name).toBe('صيدلية الحياة');
  });

  it('saves the page as one multipart POST with _method=PUT and returns the saved place', async () => {
    const update = toStoreProfileUpdate(toStoreProfileFormValue(buildStoreProfile()), null);
    const response = firstValueFrom(TestBed.inject(StoreProfileHttpRepository).saveProfile(update));

    const request = TestBed.inject(HttpTestingController).expectOne('https://api.test/owner/store');
    expect(request.request.method).toBe('POST');
    expect(request.request.body instanceof FormData).toBe(true);
    expect((request.request.body as FormData).get('name[ar]')).toBe('صيدلية الحياة');
    request.flush({ data: { ...LIVE_STORE, name: { ar: 'صيدلية الحياة الجديدة' } } });
    expect((await response).name).toBe('صيدلية الحياة الجديدة');
  });
});
