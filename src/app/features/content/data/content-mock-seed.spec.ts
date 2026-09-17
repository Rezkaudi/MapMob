import { CONTENT_MOCK_SEED } from './content-mock-seed';

describe('CONTENT_MOCK_SEED', () => {
  it('lists the five pages in the design order, all published on 26 January 2024', () => {
    expect(CONTENT_MOCK_SEED.pages.map((page) => page.title)).toEqual([
      'عن التطبيق',
      'الشروط و الأحكام',
      'سياسة الخصوصية',
      'تواصل معنا',
      'الأسئلة الشائعة',
    ]);
    expect(
      CONTENT_MOCK_SEED.pages.every(
        (page) => page.status === 'published' && page.updatedOn === '2024-01-26',
      ),
    ).toBe(true);
  });

  it('opens the FAQ with the design questions', () => {
    expect(CONTENT_MOCK_SEED.questions.map((question) => question.question)).toEqual([
      'ما هو تطبيق MapMob؟',
      'كيف يمكنني العثور على الأماكن القريبة مني؟',
      'كيف أغير الموقع أو المنطقة؟',
      'كيف يمكنني إرسال بلاغ عن مشكلة أو بيانات غير صحيحة؟',
    ]);
  });

  it('fills every page with the design copy', () => {
    expect(CONTENT_MOCK_SEED.about.address).toBe('طرطوس، شارع الثورة');
    expect(CONTENT_MOCK_SEED.legal.terms.body).toContain('1. التعريف بالخدمة');
    expect(CONTENT_MOCK_SEED.legal.privacy.body).toContain('بيانات الموقع');
    expect(CONTENT_MOCK_SEED.contact.telegramUrl).toBe('https://t.me/mapmobsupport');
  });
});
