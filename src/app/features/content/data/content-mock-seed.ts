import { ContentPage } from '../models/content-page';
import { ContentMockSeed } from './content-mock-database';
import { PRIVACY_MOCK_BODY, TERMS_MOCK_BODY } from './legal-mock-texts';

const DESIGN_UPDATE_DAY = '2024-01-26';

function publishedPage(kind: ContentPage['kind'], title: string): ContentPage {
  return { kind, title, updatedOn: DESIGN_UPDATE_DAY, status: 'published' };
}

/** The copy the content frames draw. Answers 2–4 are not in the design, so they are written here. */
export const CONTENT_MOCK_SEED: ContentMockSeed = {
  pages: [
    publishedPage('about', 'عن التطبيق'),
    publishedPage('terms', 'الشروط و الأحكام'),
    publishedPage('privacy', 'سياسة الخصوصية'),
    publishedPage('contact', 'تواصل معنا'),
    publishedPage('faq', 'الأسئلة الشائعة'),
  ],
  about: {
    title: 'عن التطبيق',
    bannerUrl: 'assets/images/about-app-banner.png',
    summary:
      '<p>هذا التطبيق هو أداتك الشاملة لاستكشاف أفضل الأماكن والخدمات من حولك. تم تصميمه بعناية ليقدم تجربة مستخدم سلسة وعصرية، معتمداً على أحدث التقنيات لتوفير نتائج دقيقة وسريعة تلبي احتياجاتك اليومية.</p>',
    phone: '+963 933 123 456',
    email: 'contact@mapmob.app',
    address: 'طرطوس، شارع الثورة',
  },
  legal: {
    terms: { title: 'الشروط و الأحكام', body: TERMS_MOCK_BODY },
    privacy: { title: 'سياسة الخصوصية', body: PRIVACY_MOCK_BODY },
  },
  contact: {
    title: 'تواصل معنا',
    introduction:
      'إذا كان لديك أي استفسار أو تحتاج إلى مساعدة، يسعدنا التواصل معك عبر إحدى وسائل الدعم المتاحة.',
    supportPhone: '+963 933 123 456',
    supportEmail: 'contact@mapmob.app',
    facebookUrl: 'https://facebook.com/mapmobapp',
    instagramUrl: 'https://instagram.com/mapmobapp',
    telegramUrl: 'https://t.me/mapmobsupport',
    whatsappUrl: 'https://wa.me/966123456789',
  },
  questions: [
    {
      id: 'faq-1',
      question: 'ما هو تطبيق MapMob؟',
      answer:
        'MapMob هو دليل جغرافي ذكي وتفاعلي يساعدك على استكشاف مدينتك بسهولة، والعثور على أفضل الأماكن والمتاجر والخدمات المحلية من صيدليات ومطاعم ومرافق حيوية.',
    },
    {
      id: 'faq-2',
      question: 'كيف يمكنني العثور على الأماكن القريبة مني؟',
      answer:
        'اسمح للتطبيق باستخدام موقعك، ثم افتح الخريطة أو اختر تصنيفاً لتظهر لك الأماكن الأقرب إليك مرتبة حسب المسافة.',
    },
    {
      id: 'faq-3',
      question: 'كيف أغير الموقع أو المنطقة؟',
      answer:
        'من الشاشة الرئيسية اضغط على اسم المنطقة في الأعلى، ثم اختر المحافظة والمنطقة التي تريدها.',
    },
    {
      id: 'faq-4',
      question: 'كيف يمكنني إرسال بلاغ عن مشكلة أو بيانات غير صحيحة؟',
      answer:
        'افتح صفحة المكان، ثم اضغط على "إبلاغ عن مشكلة"، واختر نوع المشكلة واكتب التفاصيل ثم أرسل البلاغ.',
    },
  ],
};
