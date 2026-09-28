import type { FaqQuestion } from '../../../content/models/faq-question';

export const CONTENT_PAGES = [
  { kind: 'about', title: 'عن التطبيق', updatedAt: '2026-09-20T10:00:00Z', status: 'published' },
  {
    kind: 'terms',
    title: 'الشروط والأحكام',
    updatedAt: '2026-09-18T10:00:00Z',
    status: 'published',
  },
  { kind: 'privacy', title: 'سياسة الخصوصية', updatedAt: '2026-09-18T10:00:00Z', status: 'draft' },
  { kind: 'contact', title: 'تواصل معنا', updatedAt: '2026-09-15T10:00:00Z', status: 'published' },
  { kind: 'faq', title: 'الأسئلة الشائعة', updatedAt: '2026-09-22T10:00:00Z', status: 'published' },
];

export const ABOUT_PAGE = {
  status: 'published',
  updatedAt: '2026-09-20T10:00:00Z',
  title: 'عن التطبيق',
  bannerUrl: 'https://api.mapmob.com.co/storage/content/about-banner.png',
  summary: '<p>ماب موب دليلك إلى أقرب الأماكن.</p>',
  phone: '0931234567',
  email: 'info@mapmob.com',
  address: 'دمشق، سوريا',
};

export const ABOUT_FORM = {
  title: 'عن التطبيق',
  summary: '<p>ماب موب دليلك إلى أقرب الأماكن.</p>',
  phone: '0931234567',
  email: 'info@mapmob.com',
  address: 'دمشق، سوريا',
  status: 'published',
  banner: '@about-banner.png',
  isBannerRemoved: false,
};

export const LEGAL_PAGE = {
  status: 'published',
  updatedAt: '2026-09-18T10:00:00Z',
  title: 'الشروط والأحكام',
  body: '<h2>مقدمة</h2><p>باستخدامك التطبيق فإنك توافق على...</p>',
};

export const CONTACT_PAGE = {
  status: 'published',
  updatedAt: '2026-09-15T10:00:00Z',
  title: 'تواصل معنا',
  introduction: '<p>نحن هنا لمساعدتك</p>',
  supportPhone: '0931234567',
  supportEmail: 'support@mapmob.com',
  facebookUrl: 'https://facebook.com/mapmob',
  instagramUrl: null,
  telegramUrl: 'https://t.me/mapmob',
  whatsappUrl: 'https://wa.me/963931234567',
};

export const FAQ_QUESTION = {
  id: 'q1',
  question: 'كيف أضيف متجري؟',
  answer: '<p>من صفحة التسجيل في التطبيق.</p>',
} satisfies FaqQuestion;

/** What a save sends: the page's own fields and the chosen status, never updatedAt. */
export const LEGAL_FORM = { title: LEGAL_PAGE.title, body: LEGAL_PAGE.body, status: 'published' };

export const CONTACT_FORM = (({ updatedAt: _updatedAt, ...form }) => form)(CONTACT_PAGE);
