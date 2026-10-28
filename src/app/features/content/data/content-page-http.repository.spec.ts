import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildContactPage, buildProviderJoinPage } from '../testing/content-fixture';
import { ContentPageHttpRepository } from './content-page-http.repository';

const PAGES_URL = 'https://api.test/admin/content/pages';
const SAVED_AT = '2026-10-15T18:09:59+00:00';

function livePage(title: string, extra: object = {}) {
  return { data: { title, status: 'published', updatedAt: SAVED_AT, ...extra } };
}

describe('ContentPageHttpRepository', () => {
  let repository: ContentPageHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContentPageHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
    repository = TestBed.inject(ContentPageHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('builds the table from each page, then the questions row with no date', async () => {
    const response = firstValueFrom(repository.getPages());

    http.expectOne(`${PAGES_URL}/about`).flush(livePage('عن التطبيق'));
    http.expectOne(`${PAGES_URL}/terms`).flush(livePage('الشروط'));
    http.expectOne(`${PAGES_URL}/privacy`).flush(livePage('الخصوصية'));
    http.expectOne(`${PAGES_URL}/contact`).flush(livePage('تواصل معنا'));
    http.expectOne(`${PAGES_URL}/provider-join`).flush(livePage('انضم إلينا'));

    const pages = await response;
    expect(pages.map((page) => [page.kind, page.title, page.updatedOn])).toEqual([
      ['about', 'عن التطبيق', '2026-10-15'],
      ['terms', 'الشروط', '2026-10-15'],
      ['privacy', 'الخصوصية', '2026-10-15'],
      ['provider-join', 'انضم إلينا', '2026-10-15'],
      ['contact', 'تواصل معنا', '2026-10-15'],
      ['faq', 'الأسئلة الشائعة', null],
    ]);
  });

  it('still lists the pages when the server cannot read the join page', async () => {
    const response = firstValueFrom(repository.getPages());

    for (const kind of ['about', 'terms', 'privacy', 'contact']) {
      http.expectOne(`${PAGES_URL}/${kind}`).flush(livePage(kind));
    }
    http
      .expectOne(`${PAGES_URL}/provider-join`)
      .flush(null, { status: 404, statusText: 'Not Found' });

    expect((await response)[3]).toEqual({
      kind: 'provider-join',
      title: 'انضم إلينا كمقدم خدمة',
      updatedOn: null,
      status: 'draft',
    });
  });

  it('reads the about page', async () => {
    const response = firstValueFrom(repository.getAboutPage());

    http.expectOne(`${PAGES_URL}/about`).flush(
      livePage('عن التطبيق', {
        bannerUrl: null,
        summary: '<p>x</p>',
        phone: null,
        email: null,
        address: null,
      }),
    );

    expect((await response).summary).toBe('<p>x</p>');
  });

  it('saves the about page as multipart, with PUT inside the POST', async () => {
    const response = firstValueFrom(
      repository.saveAboutPage({
        title: 'عن التطبيق',
        summary: '<p>x</p>',
        phone: '',
        email: '',
        address: '',
        status: 'published',
        banner: null,
        isBannerRemoved: false,
      }),
    );

    const request = http.expectOne(`${PAGES_URL}/about`);
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('_method')).toBe('PUT');
    request.flush(livePage('عن التطبيق', { bannerUrl: null, summary: '<p>x</p>' }));

    expect((await response).title).toBe('عن التطبيق');
  });

  it('reads and saves a legal page by its kind', async () => {
    const read = firstValueFrom(repository.getLegalPage('privacy'));
    http.expectOne(`${PAGES_URL}/privacy`).flush(livePage('Privacy Policy', { body: null }));
    expect(await read).toEqual({ title: 'سياسة الخصوصية', body: '' });

    const saved = firstValueFrom(
      repository.saveLegalPage('terms', { title: 'الشروط', body: '<p>نص</p>', status: 'draft' }),
    );
    const request = http.expectOne(`${PAGES_URL}/terms`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body.title).toEqual({ ar: 'الشروط', en: 'الشروط' });
    request.flush(livePage('الشروط', { body: '<p>نص</p>' }));
    expect((await saved).body).toBe('<p>نص</p>');
  });

  it('reads and saves the contact page', async () => {
    const contact = buildContactPage();
    const read = firstValueFrom(repository.getContactPage());
    http.expectOne(`${PAGES_URL}/contact`).flush(livePage(contact.title, contact));
    expect(await read).toEqual(contact);

    const saved = firstValueFrom(repository.saveContactPage({ ...contact, status: 'published' }));
    const request = http.expectOne(`${PAGES_URL}/contact`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body._method).toBe('PUT');
    request.flush(livePage(contact.title, contact));
    expect((await saved).supportEmail).toBe(contact.supportEmail);
  });

  it('reads and saves the join page', async () => {
    const page = buildProviderJoinPage();
    const read = firstValueFrom(repository.getProviderJoinPage());
    http
      .expectOne(`${PAGES_URL}/provider-join`)
      .flush(livePage(page.title, { registrationFormUrl: page.registrationFormUrl }));
    expect(await read).toEqual(page);

    const saved = firstValueFrom(repository.saveProviderJoinPage({ ...page, status: 'published' }));
    const request = http.expectOne(`${PAGES_URL}/provider-join`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      _method: 'PUT',
      title: { ar: page.title, en: page.title },
      registrationFormUrl: page.registrationFormUrl,
      body: { ar: page.registrationFormUrl, en: page.registrationFormUrl },
      status: 'published',
    });
    request.flush(livePage(page.title, { registrationFormUrl: page.registrationFormUrl }));
    expect(await saved).toEqual(page);
  });

  it('fails the save when the server answers without the link, so the admin is not told it was kept', async () => {
    const saved = firstValueFrom(
      repository.saveProviderJoinPage({ ...buildProviderJoinPage(), status: 'published' }),
    );

    http
      .expectOne(`${PAGES_URL}/provider-join`)
      .flush(livePage('انضم إلينا كمقدم خدمة', { kind: 'provider-join' }));

    await expect(saved).rejects.toThrow('لم يحفظ الخادم رابط نموذج التسجيل');
  });

  it('reads the link back from body, the field the server keeps for any page', async () => {
    const page = buildProviderJoinPage();
    const saved = firstValueFrom(repository.saveProviderJoinPage({ ...page, status: 'published' }));

    http
      .expectOne(`${PAGES_URL}/provider-join`)
      .flush(livePage(page.title, { kind: 'provider-join', body: page.registrationFormUrl }));

    expect(await saved).toEqual(page);
  });
});
