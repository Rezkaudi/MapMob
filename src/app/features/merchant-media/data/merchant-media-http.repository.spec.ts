import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildMediaItem, buildMediaLibrary } from '../testing/merchant-media-fixture';
import { MerchantMediaHttpRepository } from './merchant-media-http.repository';

const PICTURE = new File(['x'], 'front.jpg', { type: 'image/jpeg' });

describe('MerchantMediaHttpRepository', () => {
  let repository: MerchantMediaHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MerchantMediaHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
    repository = TestBed.inject(MerchantMediaHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it("reads the place's media with the plan's two limits", async () => {
    const response = firstValueFrom(repository.getLibrary());

    const request = http.expectOne('https://api.test/owner/media');
    expect(request.request.method).toBe('GET');
    request.flush(buildMediaLibrary());
    expect((await response).imageLimit).toBe(4);
  });

  it('adds a file with a multipart POST', async () => {
    const response = firstValueFrom(
      repository.addMedia({ kind: 'image', file: PICTURE, isMain: false }),
    );

    const request = http.expectOne('https://api.test/owner/media');
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('file')).toBe(PICTURE);
    request.flush(buildMediaItem({ id: '9' }));
    expect((await response).id).toBe('9');
  });

  it('swaps the file of one item with a multipart PUT on its id', async () => {
    const response = firstValueFrom(repository.replaceMedia('9', PICTURE));

    const request = http.expectOne('https://api.test/owner/media/9');
    expect(request.request.method).toBe('PUT');
    expect((request.request.body as FormData).get('file')).toBe(PICTURE);
    request.flush(buildMediaItem({ id: '9' }));
    expect((await response).id).toBe('9');
  });

  it('deletes one item by its id', async () => {
    const response = firstValueFrom(repository.deleteMedia('9'), { defaultValue: undefined });

    const request = http.expectOne('https://api.test/owner/media/9');
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
    await response;
  });
});
