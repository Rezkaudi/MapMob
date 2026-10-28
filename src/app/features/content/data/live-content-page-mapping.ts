import { toIsoDay } from '../../../shared/formatting/iso-day';
import { AboutPage } from '../models/about-page';
import { ContactPage } from '../models/contact-page';
import { ContentPage } from '../models/content-page';
import { ContentPageKind } from '../models/content-page-kind';
import { LegalPageKind } from '../models/content-page-kind';
import { LegalPage } from '../models/legal-page';
import { ProviderJoinPage } from '../models/provider-join-page';
import { toArabicPageTitle } from './arabic-page-title';
import { LiveAboutPage } from './live-about-page';
import { LiveContactPage } from './live-contact-page';
import { LiveContentPage } from './live-content-page';
import { LiveLegalPage } from './live-legal-page';
import { LiveProviderJoinPage } from './live-provider-join-page';

/** The server's list cannot tell the terms from the privacy page, so each row comes from its own page. */
export function toContentPage(kind: ContentPageKind, live: LiveContentPage): ContentPage {
  return {
    kind,
    title: toArabicPageTitle(kind, live.title),
    updatedOn: toIsoDay(live.updatedAt),
    status: live.status,
  };
}

export function toAboutPage(live: LiveAboutPage): AboutPage {
  return {
    title: toArabicPageTitle('about', live.title),
    bannerUrl: live.bannerUrl,
    summary: live.summary ?? '',
    phone: live.phone ?? '',
    email: live.email ?? '',
    address: live.address ?? '',
  };
}

export function toLegalPage(kind: LegalPageKind, live: LiveLegalPage): LegalPage {
  return { title: toArabicPageTitle(kind, live.title), body: live.body ?? '' };
}

export function toContactPage(live: LiveContactPage): ContactPage {
  return {
    title: toArabicPageTitle('contact', live.title),
    introduction: live.introduction ?? '',
    supportPhone: live.supportPhone ?? '',
    supportEmail: live.supportEmail ?? '',
    facebookUrl: live.facebookUrl ?? '',
    instagramUrl: live.instagramUrl ?? '',
    telegramUrl: live.telegramUrl ?? '',
    whatsappUrl: live.whatsappUrl ?? '',
  };
}

export function toProviderJoinPage(live: LiveProviderJoinPage): ProviderJoinPage {
  return {
    title: toArabicPageTitle('provider-join', live.title),
    registrationFormUrl: live.registrationFormUrl || live.body || '',
  };
}
