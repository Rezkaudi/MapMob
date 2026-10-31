import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { MerchantStoriesHttpRepository } from './merchant-stories-http.repository';

const PICTURE = new File(['x'], 'serum.jpg', { type: 'image/jpeg' });

const STORIES_URL = 'https://api.test/owner/stories';
const LIVE_STORY = {
  id: '14',
  storeId: '88',
  type: 'image',
  caption: 'نص',
  url: 'https://api.test/storage/14.jpg',
  status: 'active',
  expiresAt: '2026-10-30T06:37:48+00:00',
  createdAt: '2026-10-29T06:37:48+00:00',
};

describe('MerchantStoriesHttpRepository', () => {
  let repository: MerchantStoriesHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MerchantStoriesHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
    repository = TestBed.inject(MerchantStoriesHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it("reads every story with the plan's limit and the place name", async () => {
    const response = firstValueFrom(repository.getLibrary());

    http.expectOne('https://api.test/owner/stories/summary').flush({
      data: { plan: { id: '13', name: 'باقة القصص' }, quota: { limit: 2 } },
    });
    http.expectOne('https://api.test/owner/overview/summary').flush({
      data: { place: { id: '88', name: 'مطعم الروابي' } },
    });
    http
      .expectOne((one) => one.url === STORIES_URL)
      .flush({
        data: [LIVE_STORY, { ...LIVE_STORY, id: '15', status: 'hidden', type: 'video' }],
        meta: { current_page: 1, last_page: 1 },
      });

    const library = await response;
    expect(library.plan).toEqual({ id: '13', name: 'باقة القصص' });
    expect(library.place).toEqual({ id: '88', name: 'مطعم الروابي' });
    expect(library.activeStoryLimit).toBe(2);
    expect(library.items[0]).toEqual({
      id: '14',
      kind: 'image',
      url: 'https://api.test/storage/14.jpg',
      posterUrl: null,
      caption: 'نص',
      status: 'active',
      publishedAt: '2026-10-29T06:37:48+00:00',
      expiresAt: '2026-10-30T06:37:48+00:00',
      viewCount: 0,
    });
    expect(library.items[1].status).toBe('expired');
    expect(library.items[1].kind).toBe('video');
  });

  it('publishes a story with its kind, read from the file', async () => {
    const response = firstValueFrom(repository.addStory({ file: PICTURE, caption: 'نص' }));

    const request = http.expectOne(STORIES_URL);
    expect(request.request.method).toBe('POST');
    const body = request.request.body as FormData;
    expect(body.get('type')).toBe('image');
    expect(body.get('file')).toBe(PICTURE);
    expect(body.get('caption')).toBe('نص');
    request.flush({ status_code: 201, data: { ...LIVE_STORY, id: '9' } });
    expect((await response).id).toBe('9');
  });

  it('saves an edit as POST with _method=PUT, clearing a removed text', async () => {
    const response = firstValueFrom(repository.updateStory('9', { file: null, caption: null }));

    const request = http.expectOne(`${STORIES_URL}/9`);
    expect(request.request.method).toBe('POST');
    const body = request.request.body as FormData;
    expect(body.get('_method')).toBe('PUT');
    expect(body.has('file')).toBe(false);
    expect(body.get('caption')).toBe('');
    request.flush({ data: { ...LIVE_STORY, id: '9', caption: null } });
    expect((await response).caption).toBeNull();
  });

  it('deletes one story by its id', async () => {
    const response = firstValueFrom(repository.deleteStory('9'), { defaultValue: undefined });

    const request = http.expectOne(`${STORIES_URL}/9`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ status_code: 200, data: null });
    await response;
  });
});
