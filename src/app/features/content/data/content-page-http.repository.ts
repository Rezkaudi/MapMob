import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AboutPage } from '../models/about-page';
import { AboutPageDraft } from '../models/about-page-draft';
import { ContactPage } from '../models/contact-page';
import { ContactPageDraft } from '../models/contact-page-draft';
import { ContentPage } from '../models/content-page';
import { LegalPageKind } from '../models/content-page-kind';
import { LegalPage } from '../models/legal-page';
import { LegalPageDraft } from '../models/legal-page-draft';
import { toAboutPageFormData } from './about-page-form-data';
import { ContentPageRepository } from './content-page.repository';

@Injectable()
export class ContentPageHttpRepository implements ContentPageRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get pagesUrl(): string {
    return `${this.apiBaseUrl}/content/pages`;
  }

  getPages(): Observable<readonly ContentPage[]> {
    return this.httpClient.get<readonly ContentPage[]>(this.pagesUrl);
  }

  getAboutPage(): Observable<AboutPage> {
    return this.httpClient.get<AboutPage>(`${this.pagesUrl}/about`);
  }

  saveAboutPage(draft: AboutPageDraft): Observable<AboutPage> {
    return this.httpClient.put<AboutPage>(`${this.pagesUrl}/about`, toAboutPageFormData(draft));
  }

  getLegalPage(kind: LegalPageKind): Observable<LegalPage> {
    return this.httpClient.get<LegalPage>(`${this.pagesUrl}/${kind}`);
  }

  saveLegalPage(kind: LegalPageKind, draft: LegalPageDraft): Observable<LegalPage> {
    return this.httpClient.put<LegalPage>(`${this.pagesUrl}/${kind}`, draft);
  }

  getContactPage(): Observable<ContactPage> {
    return this.httpClient.get<ContactPage>(`${this.pagesUrl}/contact`);
  }

  saveContactPage(draft: ContactPageDraft): Observable<ContactPage> {
    return this.httpClient.put<ContactPage>(`${this.pagesUrl}/contact`, draft);
  }
}
