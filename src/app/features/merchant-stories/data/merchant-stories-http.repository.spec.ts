import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildStory, buildStoryLibrary } from '../testing/merchant-story-fixture';
import { MerchantStoriesHttpRepository } from './merchant-stories-http.repository';

const PICTURE = new File(['x'], 'serum.jpg', { type: 'image/jpeg' });

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

  it("reads the place's stories with the plan's limit", async () => {
    const response = firstValueFrom(repository.getLibrary());

    const request = http.expectOne('https://api.test/owner/stories');
    expect(request.request.method).toBe('GET');
    request.flush(buildStoryLibrary());
    expect((await response).activeStoryLimit).toBe(5);
  });

  it('publishes a story with a multipart POST', async () => {
    const response = firstValueFrom(repository.addStory({ file: PICTURE, caption: 'نص' }));

    const request = http.expectOne('https://api.test/owner/stories');
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('file')).toBe(PICTURE);
    expect((request.request.body as FormData).get('caption')).toBe('نص');
    request.flush(buildStory({ id: '9' }));
    expect((await response).id).toBe('9');
  });

  it('saves an edit with a multipart PUT on the story id', async () => {
    const response = firstValueFrom(repository.updateStory('9', { file: null, caption: 'نص' }));

    const request = http.expectOne('https://api.test/owner/stories/9');
    expect(request.request.method).toBe('PUT');
    expect((request.request.body as FormData).has('file')).toBe(false);
    request.flush(buildStory({ id: '9', caption: 'نص' }));
    expect((await response).caption).toBe('نص');
  });

  it('deletes one story by its id', async () => {
    const response = firstValueFrom(repository.deleteStory('9'), { defaultValue: undefined });

    const request = http.expectOne('https://api.test/owner/stories/9');
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
    await response;
  });
});
