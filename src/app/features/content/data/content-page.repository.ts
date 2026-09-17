import { Observable } from 'rxjs';
import { AboutPage } from '../models/about-page';
import { AboutPageDraft } from '../models/about-page-draft';
import { ContactPage } from '../models/contact-page';
import { ContactPageDraft } from '../models/contact-page-draft';
import { ContentPage } from '../models/content-page';
import { LegalPageKind } from '../models/content-page-kind';
import { LegalPage } from '../models/legal-page';
import { LegalPageDraft } from '../models/legal-page-draft';

export abstract class ContentPageRepository {
  abstract getPages(): Observable<readonly ContentPage[]>;
  abstract getAboutPage(): Observable<AboutPage>;
  abstract saveAboutPage(draft: AboutPageDraft): Observable<AboutPage>;
  abstract getLegalPage(kind: LegalPageKind): Observable<LegalPage>;
  abstract saveLegalPage(kind: LegalPageKind, draft: LegalPageDraft): Observable<LegalPage>;
  abstract getContactPage(): Observable<ContactPage>;
  abstract saveContactPage(draft: ContactPageDraft): Observable<ContactPage>;
}
