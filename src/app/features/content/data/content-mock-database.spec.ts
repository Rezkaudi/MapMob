import {
  buildAboutPage,
  buildContactPage,
  buildContentPage,
  buildFaqQuestion,
  buildLegalPage,
} from '../testing/content-fixture';
import { ContentMockDatabase, ContentMockSeed } from './content-mock-database';

const TODAY = '2026-09-17';

function createDatabase() {
  const seed: ContentMockSeed = {
    pages: [
      buildContentPage(),
      buildContentPage({ kind: 'terms', title: 'الشروط و الأحكام' }),
      buildContentPage({ kind: 'privacy', title: 'سياسة الخصوصية' }),
      buildContentPage({ kind: 'contact', title: 'تواصل معنا' }),
      buildContentPage({ kind: 'faq', title: 'الأسئلة الشائعة' }),
    ],
    about: buildAboutPage(),
    legal: {
      terms: buildLegalPage(),
      privacy: buildLegalPage({ title: 'سياسة الخصوصية' }),
    },
    contact: buildContactPage(),
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
    ).toEqual(['about', 'terms', 'privacy', 'contact', 'faq']);
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
    expect(database.listPages()[0]).toEqual({
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

  it('saves a legal page by its kind', () => {
    const database = createDatabase();

    database.saveLegalPage('privacy', {
      title: 'الخصوصية',
      body: '<p>نص</p>',
      status: 'published',
    });

    expect(database.legalPage('privacy').body).toBe('<p>نص</p>');
    expect(database.legalPage('terms').title).toBe('الشروط و الأحكام');
    expect(database.listPages()[2].title).toBe('الخصوصية');
  });

  it('saves the contact page', () => {
    const database = createDatabase();

    database.saveContactPage({ ...buildContactPage({ supportPhone: '+2' }), status: 'published' });

    expect(database.contactPage().supportPhone).toBe('+2');
    expect(database.listPages()[3].updatedOn).toBe(TODAY);
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
    expect(database.listPages()[4].updatedOn).toBe(TODAY);
  });

  it('says when a question is missing', () => {
    expect(() =>
      createDatabase().updateQuestion('missing', { question: 'x', answer: 'y' }),
    ).toThrowError('لم يتم العثور على السؤال');
  });
});
