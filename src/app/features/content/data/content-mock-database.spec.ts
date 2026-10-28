import {
  buildAboutPage,
  buildContactPage,
  buildContentPage,
  buildFaqQuestion,
  buildLegalPage,
  buildProviderJoinPage,
} from '../testing/content-fixture';
import { ContentPageKind } from '../models/content-page-kind';
import { ContentMockDatabase, ContentMockSeed } from './content-mock-database';

const TODAY = '2026-09-17';

function rowOf(database: ContentMockDatabase, kind: ContentPageKind) {
  return database.listPages().find((page) => page.kind === kind);
}

function createDatabase() {
  const seed: ContentMockSeed = {
    pages: [
      buildContentPage(),
      buildContentPage({ kind: 'terms', title: 'الشروط و الأحكام' }),
      buildContentPage({ kind: 'privacy', title: 'سياسة الخصوصية' }),
      buildContentPage({ kind: 'provider-join', title: 'انضم إلينا كمقدم خدمة' }),
      buildContentPage({ kind: 'contact', title: 'تواصل معنا' }),
      buildContentPage({ kind: 'faq', title: 'الأسئلة الشائعة' }),
    ],
    about: buildAboutPage(),
    legal: {
      terms: buildLegalPage(),
      privacy: buildLegalPage({ title: 'سياسة الخصوصية' }),
    },
    contact: buildContactPage(),
    providerJoin: buildProviderJoinPage(),
    questions: [buildFaqQuestion(), buildFaqQuestion({ id: 'faq-2', question: 'سؤال ثان؟' })],
  };
  return new ContentMockDatabase(seed, () => TODAY);
}

describe('ContentMockDatabase', () => {
  it('lists the pages', () => {
    expect(
      createDatabase()
        .listPages()
        .map((page) => page.kind),
    ).toEqual(['about', 'terms', 'privacy', 'provider-join', 'contact', 'faq']);
  });

  it('saves the about page, keeps its banner, and stamps the row with the new title and status', () => {
    const database = createDatabase();

    const saved = database.saveAboutPage({
      title: 'من نحن',
      summary: '<p>جديد</p>',
      phone: '+1',
      email: 'new@mapmob.app',
      address: 'دمشق',
      banner: null,
      isBannerRemoved: false,
      status: 'draft',
    });

    expect(saved.bannerUrl).toBe('assets/images/about-app-banner.png');
    expect(database.aboutPage().summary).toBe('<p>جديد</p>');
    expect(rowOf(database, 'about')).toEqual({
      kind: 'about',
      title: 'من نحن',
      updatedOn: TODAY,
      status: 'draft',
    });
  });

  it('drops the banner when it is removed and no new one is picked', () => {
    const database = createDatabase();

    const saved = database.saveAboutPage({
      ...buildAboutPage(),
      banner: null,
      isBannerRemoved: true,
      status: 'published',
    });

    expect(saved.bannerUrl).toBeNull();
  });

  it('saves the join page and stamps its row with the new title and status', () => {
    const database = createDatabase();

    const saved = database.saveProviderJoinPage({
      title: 'كن شريكاً',
      registrationFormUrl: 'https://forms.example.com/join',
      status: 'published',
    });

    expect(saved).toEqual({
      title: 'كن شريكاً',
      registrationFormUrl: 'https://forms.example.com/join',
    });
    expect(database.providerJoinPage()).toEqual(saved);
    expect(rowOf(database, 'provider-join')).toEqual({
      kind: 'provider-join',
      title: 'كن شريكاً',
      updatedOn: TODAY,
      status: 'published',
    });
  });

  it('saves a legal page by its kind', () => {
    const database = createDatabase();

    database.saveLegalPage('privacy', {
      title: 'الخصوصية',
      body: '<p>نص</p>',
      status: 'published',
    });

    expect(database.legalPage('privacy').body).toBe('<p>نص</p>');
    expect(database.legalPage('terms').title).toBe('الشروط و الأحكام');
    expect(rowOf(database, 'privacy')?.title).toBe('الخصوصية');
  });

  it('saves the contact page', () => {
    const database = createDatabase();

    database.saveContactPage({ ...buildContactPage({ supportPhone: '+2' }), status: 'published' });

    expect(database.contactPage().supportPhone).toBe('+2');
    expect(rowOf(database, 'contact')?.updatedOn).toBe(TODAY);
  });

  it('adds, updates and deletes questions, and stamps the FAQ row', () => {
    const database = createDatabase();

    const added = database.addQuestion({ question: 'جديد؟', answer: 'نعم' });
    database.updateQuestion('faq-1', { question: 'معدل؟', answer: 'تم' });
    database.deleteQuestion('faq-2');

    expect(added.id).toBe('faq-3');
    expect(database.listQuestions()).toEqual([
      { id: 'faq-1', question: 'معدل؟', answer: 'تم' },
      { id: 'faq-3', question: 'جديد؟', answer: 'نعم' },
    ]);
    expect(rowOf(database, 'faq')?.updatedOn).toBe(TODAY);
  });

  it('says when a question is missing', () => {
    expect(() =>
      createDatabase().updateQuestion('missing', { question: 'x', answer: 'y' }),
    ).toThrowError('لم يتم العثور على السؤال');
  });
});
