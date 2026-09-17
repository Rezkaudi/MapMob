import { AboutPage } from '../models/about-page';
import { AboutPageDraft } from '../models/about-page-draft';
import { ContactPage } from '../models/contact-page';
import { ContactPageDraft } from '../models/contact-page-draft';
import { ContentPage } from '../models/content-page';
import { ContentPageKind, LegalPageKind } from '../models/content-page-kind';
import { ContentPageStatus } from '../models/content-page-status';
import { FaqQuestion } from '../models/faq-question';
import { FaqQuestionDraft } from '../models/faq-question-draft';
import { LegalPage } from '../models/legal-page';
import { LegalPageDraft } from '../models/legal-page-draft';

export interface ContentMockSeed {
  readonly pages: readonly ContentPage[];
  readonly about: AboutPage;
  readonly legal: Readonly<Record<LegalPageKind, LegalPage>>;
  readonly contact: ContactPage;
  readonly questions: readonly FaqQuestion[];
}

const QUESTION_ID_PREFIX = 'faq-';

/** In-memory store behind the mock repositories, so saves stick until the page reloads. */
export class ContentMockDatabase {
  private pages: readonly ContentPage[];
  private about: AboutPage;
  private legal: Readonly<Record<LegalPageKind, LegalPage>>;
  private contact: ContactPage;
  private questions: readonly FaqQuestion[];

  constructor(
    seed: ContentMockSeed,
    /** Today as `yyyy-mm-dd`, for the "آخر تحديث" column. */
    private readonly today: () => string,
  ) {
    this.pages = seed.pages;
    this.about = seed.about;
    this.legal = seed.legal;
    this.contact = seed.contact;
    this.questions = seed.questions;
  }

  listPages(): readonly ContentPage[] {
    return this.pages;
  }

  aboutPage(): AboutPage {
    return this.about;
  }

  saveAboutPage({ banner, isBannerRemoved, status, ...fields }: AboutPageDraft): AboutPage {
    const keptBannerUrl = isBannerRemoved ? null : this.about.bannerUrl;
    const bannerUrl = banner ? URL.createObjectURL(banner) : keptBannerUrl;
    this.about = { ...fields, bannerUrl };
    this.stampPage('about', fields.title, status);
    return this.about;
  }

  legalPage(kind: LegalPageKind): LegalPage {
    return this.legal[kind];
  }

  saveLegalPage(kind: LegalPageKind, { status, ...page }: LegalPageDraft): LegalPage {
    this.legal = { ...this.legal, [kind]: page };
    this.stampPage(kind, page.title, status);
    return page;
  }

  contactPage(): ContactPage {
    return this.contact;
  }

  saveContactPage({ status, ...page }: ContactPageDraft): ContactPage {
    this.contact = page;
    this.stampPage('contact', page.title, status);
    return page;
  }

  listQuestions(): readonly FaqQuestion[] {
    return this.questions;
  }

  addQuestion(draft: FaqQuestionDraft): FaqQuestion {
    const question = { id: this.nextQuestionId(), ...draft };
    this.questions = [...this.questions, question];
    this.stampFaqPage();
    return question;
  }

  updateQuestion(id: string, draft: FaqQuestionDraft): FaqQuestion {
    this.findQuestion(id);
    const updated = { id, ...draft };
    this.questions = this.questions.map((question) => (question.id === id ? updated : question));
    this.stampFaqPage();
    return updated;
  }

  deleteQuestion(id: string): void {
    this.findQuestion(id);
    this.questions = this.questions.filter((question) => question.id !== id);
    this.stampFaqPage();
  }

  private findQuestion(id: string): FaqQuestion {
    const question = this.questions.find((candidate) => candidate.id === id);
    if (!question) {
      throw new Error('لم يتم العثور على السؤال');
    }
    return question;
  }

  private nextQuestionId(): string {
    const numbers = this.questions.map((question) =>
      Number(question.id.slice(QUESTION_ID_PREFIX.length)),
    );
    return `${QUESTION_ID_PREFIX}${Math.max(0, ...numbers) + 1}`;
  }

  private stampFaqPage(): void {
    const faqPage = this.pages.find((page) => page.kind === 'faq');
    if (faqPage) {
      this.stampPage('faq', faqPage.title, faqPage.status);
    }
  }

  private stampPage(kind: ContentPageKind, title: string, status: ContentPageStatus): void {
    this.pages = this.pages.map((page) =>
      page.kind === kind ? { kind, title, status, updatedOn: this.today() } : page,
    );
  }
}
