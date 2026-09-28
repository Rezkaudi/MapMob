import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { toStoreProfileFormValue, toStoreProfileUpdate } from '../state/store-profile-form-mapping';
import { buildStoreProfile } from '../testing/store-profile-fixture';
import { StoreProfileHttpRepository } from './store-profile-http.repository';

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

    const request = TestBed.inject(HttpTestingController).expectOne('https://api.test/owner/place');
    expect(request.request.method).toBe('GET');
    request.flush(buildStoreProfile());
    expect((await response).name).toBe('صيدلية الحياة');
  });

  it('saves the page as one multipart PUT and returns the saved place', async () => {
    const update = toStoreProfileUpdate(toStoreProfileFormValue(buildStoreProfile()), null);
    const response = firstValueFrom(TestBed.inject(StoreProfileHttpRepository).saveProfile(update));

    const request = TestBed.inject(HttpTestingController).expectOne('https://api.test/owner/place');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body instanceof FormData).toBe(true);
    expect((request.request.body as FormData).get('name')).toBe('صيدلية الحياة');
    request.flush(buildStoreProfile({ name: 'صيدلية الحياة الجديدة' }));
    expect((await response).name).toBe('صيدلية الحياة الجديدة');
  });
});
