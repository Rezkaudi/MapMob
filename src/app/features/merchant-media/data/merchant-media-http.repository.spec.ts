import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { MerchantMediaHttpRepository } from './merchant-media-http.repository';

const PICTURE = new File(['x'], 'front.jpg', { type: 'image/jpeg' });
const MEDIA_URL = 'https://api.test/owner/media';
const LIVE_PICTURE = {
  id: '13',
  type: 'image',
  url: 'https://api.test/m/13.jpg',
  sortOrder: 1,
  createdAt: '2026-10-29T06:35:36+00:00',
};

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

  it('reads every file with the one shared limit of the plan', async () => {
    const response = firstValueFrom(repository.getLibrary());

    http.expectOne(`${MEDIA_URL}/summary`).flush({
      data: { plan: { id: '1', name: 'الباقة الذهبية' }, quota: { limit: 20 } },
    });
    http
      .expectOne((one) => one.url === MEDIA_URL)
      .flush({
        data: [
          LIVE_PICTURE,
          { ...LIVE_PICTURE, id: '18', type: 'video', url: 'https://api.test/m/18.mp4' },
        ],
        meta: { current_page: 1, last_page: 1 },
      });

    const library = await response;
    expect(library.plan).toEqual({ id: '1', name: 'الباقة الذهبية' });
    expect(library.imageLimit).toBeNull();
    expect(library.videoLimit).toBeNull();
    expect(library.totalLimit).toBe(20);
    expect(library.items[0]).toEqual({
      id: '13',
      kind: 'image',
      url: 'https://api.test/m/13.jpg',
      posterUrl: null,
      mimeType: 'image/jpeg',
      sizeBytes: 0,
      isMain: false,
      createdAt: '2026-10-29T06:35:36+00:00',
    });
    expect(library.items[1].mimeType).toBe('video/mp4');
  });

  it('adds a file with its kind', async () => {
    const response = firstValueFrom(
      repository.addMedia({ kind: 'image', file: PICTURE, isMain: false }),
    );

    const request = http.expectOne(MEDIA_URL);
    expect(request.request.method).toBe('POST');
    const body = request.request.body as FormData;
    expect(body.get('type')).toBe('image');
    expect(body.get('file')).toBe(PICTURE);
    request.flush({ status_code: 201, data: LIVE_PICTURE });
    expect((await response).id).toBe('13');
  });

  it('swaps the file of one item as POST with _method=PUT on its id', async () => {
    const response = firstValueFrom(repository.replaceMedia('13', PICTURE));

    const request = http.expectOne(`${MEDIA_URL}/13`);
    expect(request.request.method).toBe('POST');
    const body = request.request.body as FormData;
    expect(body.get('_method')).toBe('PUT');
    expect(body.get('type')).toBe('image');
    expect(body.get('file')).toBe(PICTURE);
    request.flush({ data: LIVE_PICTURE });
    expect((await response).id).toBe('13');
  });

  it('deletes one item by its id', async () => {
    const response = firstValueFrom(repository.deleteMedia('13'), { defaultValue: undefined });

    const request = http.expectOne(`${MEDIA_URL}/13`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ status_code: 200, data: null });
    await response;
  });
});
