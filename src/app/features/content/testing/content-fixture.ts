import { AboutPage } from '../models/about-page';
import { ContactPage } from '../models/contact-page';
import { ContentPage } from '../models/content-page';
import { FaqQuestion } from '../models/faq-question';
import { LegalPage } from '../models/legal-page';

export function buildContentPage(overrides: Partial<ContentPage> = {}): ContentPage {
  return {
    kind: 'about',
    title: 'عن التطبيق',
    updatedOn: '2024-01-26',
    status: 'published',
    ...overrides,
  };
}

export function buildAboutPage(overrides: Partial<AboutPage> = {}): AboutPage {
  return {
    title: 'عن التطبيق',
    bannerUrl: 'assets/images/about-app-banner.png',
    summary: '<p>هذا التطبيق هو أداتك الشاملة لاستكشاف أفضل الأماكن.</p>',
    phone: '+963 933 123 456',
    email: 'contact@mapmob.app',
    address: 'طرطوس، شارع الثورة',
    ...overrides,
  };
}

export function buildLegalPage(overrides: Partial<LegalPage> = {}): LegalPage {
  return {
    title: 'الشروط و الأحكام',
    body: '<p>مرحباً بك في MapMob.</p>',
    ...overrides,
  };
}

export function buildContactPage(overrides: Partial<ContactPage> = {}): ContactPage {
  return {
    title: 'تواصل معنا',
    introduction: 'إذا كان لديك أي استفسار أو تحتاج إلى مساعدة، يسعدنا التواصل معك.',
    supportPhone: '+963 933 123 456',
    supportEmail: 'contact@mapmob.app',
    facebookUrl: 'https://facebook.com/mapmobapp',
    instagramUrl: 'https://instagram.com/mapmobapp',
    telegramUrl: 'https://t.me/mapmobsupport',
    whatsappUrl: 'https://wa.me/966123456789',
    ...overrides,
  };
}

export function buildFaqQuestion(overrides: Partial<FaqQuestion> = {}): FaqQuestion {
  return {
    id: 'faq-1',
    question: 'ما هو تطبيق MapMob؟',
    answer: 'MapMob هو دليل جغرافي ذكي وتفاعلي.',
    ...overrides,
  };
}
