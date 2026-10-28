import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { AboutPage } from '../models/about-page';
import { AboutPageDraft } from '../models/about-page-draft';
import { ContactPage } from '../models/contact-page';
import { ContactPageDraft } from '../models/contact-page-draft';
import { ContentPage } from '../models/content-page';
import { LegalPageKind } from '../models/content-page-kind';
import { LegalPage } from '../models/legal-page';
import { LegalPageDraft } from '../models/legal-page-draft';
import { ProviderJoinPage } from '../models/provider-join-page';
import { ProviderJoinPageDraft } from '../models/provider-join-page-draft';
import { CONTENT_PAGE_NAMES } from '../state/content-page-names';
import { ContentPageRepository } from './content-page.repository';
import { LiveAboutPage } from './live-about-page';
import { LiveContactPage } from './live-contact-page';
import { LiveLegalPage } from './live-legal-page';
import { LiveProviderJoinPage } from './live-provider-join-page';
import {
  toLiveAboutForm,
  toLiveContactBody,
  toLiveLegalBody,
  toLiveProviderJoinBody,
} from './live-content-page-bodies';
import {
  toAboutPage,
  toContactPage,
  toContentPage,
  toLegalPage,
  toProviderJoinPage,
} from './live-content-page-mapping';

// The questions are a list on the server, not a page, so their row has no saved date.
const FAQ_ROW: ContentPage = {
  kind: 'faq',
  title: 'الأسئلة الشائعة',
  updatedOn: null,
  status: 'published',
};

// The newest page: until the server keeps it, its row still opens the editor.
const UNSAVED_PROVIDER_JOIN_ROW: ContentPage = {
  kind: 'provider-join',
  title: CONTENT_PAGE_NAMES['provider-join'],
  updatedOn: null,
  status: 'draft',
};

// The server answers 200 even when it drops a field it does not know, so a missing link means it was not kept.
const LINK_NOT_KEPT_MESSAGE =
  'لم يحفظ الخادم رابط نموذج التسجيل. هذه الصفحة تحتاج دعماً من فريق الخادم.';

@Injectable()
export class ContentPageHttpRepository implements ContentPageRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly pagesUrl = `${inject(API_BASE_URL)}/admin/content/pages`;

  getPages(): Observable<readonly ContentPage[]> {
    return forkJoin({
      about: this.read<LiveAboutPage>('about'),
      terms: this.read<LiveLegalPage>('terms'),
      privacy: this.read<LiveLegalPage>('privacy'),
      contact: this.read<LiveContactPage>('contact'),
      providerJoin: this.read<LiveProviderJoinPage>('provider-join').pipe(
        map((page): ContentPage => toContentPage('provider-join', page)),
        catchError(() => of(UNSAVED_PROVIDER_JOIN_ROW)),
      ),
    }).pipe(
      map((pages) => [
        toContentPage('about', pages.about),
        toContentPage('terms', pages.terms),
        toContentPage('privacy', pages.privacy),
        pages.providerJoin,
        toContentPage('contact', pages.contact),
        FAQ_ROW,
      ]),
    );
  }

  getAboutPage(): Observable<AboutPage> {
    return this.read<LiveAboutPage>('about').pipe(map(toAboutPage));
  }

  saveAboutPage(draft: AboutPageDraft): Observable<AboutPage> {
    return this.save<LiveAboutPage>('about', toLiveAboutForm(draft)).pipe(map(toAboutPage));
  }

  getLegalPage(kind: LegalPageKind): Observable<LegalPage> {
    return this.read<LiveLegalPage>(kind).pipe(map((live) => toLegalPage(kind, live)));
  }

  saveLegalPage(kind: LegalPageKind, draft: LegalPageDraft): Observable<LegalPage> {
    return this.save<LiveLegalPage>(kind, toLiveLegalBody(draft)).pipe(
      map((live) => toLegalPage(kind, live)),
    );
  }

  getContactPage(): Observable<ContactPage> {
    return this.read<LiveContactPage>('contact').pipe(map(toContactPage));
  }

  saveContactPage(draft: ContactPageDraft): Observable<ContactPage> {
    return this.save<LiveContactPage>('contact', toLiveContactBody(draft)).pipe(map(toContactPage));
  }

  getProviderJoinPage(): Observable<ProviderJoinPage> {
    return this.read<LiveProviderJoinPage>('provider-join').pipe(map(toProviderJoinPage));
  }

  saveProviderJoinPage(draft: ProviderJoinPageDraft): Observable<ProviderJoinPage> {
    return this.save<LiveProviderJoinPage>('provider-join', toLiveProviderJoinBody(draft)).pipe(
      map(toProviderJoinPage),
      switchMap((page) =>
        page.registrationFormUrl ? of(page) : throwError(() => new Error(LINK_NOT_KEPT_MESSAGE)),
      ),
    );
  }

  private read<T>(kind: string): Observable<T> {
    return this.httpClient
      .get<LiveEnvelope<T>>(`${this.pagesUrl}/${kind}`)
      .pipe(map(({ data }) => data));
  }

  private save<T>(kind: string, body: FormData | object): Observable<T> {
    return this.httpClient
      .post<LiveEnvelope<T>>(`${this.pagesUrl}/${kind}`, body)
      .pipe(map(({ data }) => data));
  }
}
