import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AboutPage } from '../models/about-page';
import { AboutPageDraft } from '../models/about-page-draft';
import { ContactPage } from '../models/contact-page';
import { ContactPageDraft } from '../models/contact-page-draft';
import { ContentPage } from '../models/content-page';
import { LegalPageKind } from '../models/content-page-kind';
import { LegalPage } from '../models/legal-page';
import { LegalPageDraft } from '../models/legal-page-draft';
import { ContentMockDatabaseLoader } from './content-mock-database-loader';
import { ContentPageRepository } from './content-page.repository';

@Injectable()
export class ContentPageMockRepository implements ContentPageRepository {
  private readonly loader = inject(ContentMockDatabaseLoader);

  getPages(): Observable<readonly ContentPage[]> {
    return this.loader.request((database) => database.listPages());
  }

  getAboutPage(): Observable<AboutPage> {
    return this.loader.request((database) => database.aboutPage());
  }

  saveAboutPage(draft: AboutPageDraft): Observable<AboutPage> {
    return this.loader.request((database) => database.saveAboutPage(draft));
  }

  getLegalPage(kind: LegalPageKind): Observable<LegalPage> {
    return this.loader.request((database) => database.legalPage(kind));
  }

  saveLegalPage(kind: LegalPageKind, draft: LegalPageDraft): Observable<LegalPage> {
    return this.loader.request((database) => database.saveLegalPage(kind, draft));
  }

  getContactPage(): Observable<ContactPage> {
    return this.loader.request((database) => database.contactPage());
  }

  saveContactPage(draft: ContactPageDraft): Observable<ContactPage> {
    return this.loader.request((database) => database.saveContactPage(draft));
  }
}
