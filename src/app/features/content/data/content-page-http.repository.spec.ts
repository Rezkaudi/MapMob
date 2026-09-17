import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildContactPage } from '../testing/content-fixture';
import { ContentPageHttpRepository } from './content-page-http.repository';

const BASE_URL = 'https://api.test';

describe('ContentPageHttpRepository', () => {
  let repository: ContentPageHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContentPageHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(ContentPageHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the list of pages', () => {
    repository.getPages().subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/content/pages` }).flush([]);
  });

  it('loads and saves the about page as multipart, so the banner travels with it', () => {
    repository.getAboutPage().subscribe();
    http.expectOne({ method: 'GET', url: `${BASE_URL}/content/pages/about` }).flush({});

    repository
      .saveAboutPage({
        title: 'عن التطبيق',
        summary: '<p>نبذة</p>',
        phone: '+963',
        email: 'a@b.c',
        address: 'طرطوس',
        banner: null,
        isBannerRemoved: false,
        status: 'published',
      })
      .subscribe();
    const request = http.expectOne({ method: 'PUT', url: `${BASE_URL}/content/pages/about` });
    expect(request.request.body).toBeInstanceOf(FormData);
    request.flush({});
  });

  it('loads and saves a legal page by its kind', () => {
    repository.getLegalPage('privacy').subscribe();
    http.expectOne({ method: 'GET', url: `${BASE_URL}/content/pages/privacy` }).flush({});

    repository
      .saveLegalPage('terms', { title: 'الشروط', body: '<p>نص</p>', status: 'draft' })
      .subscribe();
    const request = http.expectOne({ method: 'PUT', url: `${BASE_URL}/content/pages/terms` });
    expect(request.request.body).toEqual({ title: 'الشروط', body: '<p>نص</p>', status: 'draft' });
    request.flush({});
  });

  it('loads and saves the contact page', () => {
    repository.getContactPage().subscribe();
    http.expectOne({ method: 'GET', url: `${BASE_URL}/content/pages/contact` }).flush({});

    const draft = { ...buildContactPage(), status: 'published' as const };
    repository.saveContactPage(draft).subscribe();
    const request = http.expectOne({ method: 'PUT', url: `${BASE_URL}/content/pages/contact` });
    expect(request.request.body).toEqual(draft);
    request.flush({});
  });
});
