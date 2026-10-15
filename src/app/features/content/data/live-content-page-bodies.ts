import { inBothLanguages } from '../../../shared/data/in-both-languages';
import { AboutPageDraft } from '../models/about-page-draft';
import { ContactPageDraft } from '../models/contact-page-draft';
import { FaqQuestionDraft } from '../models/faq-question-draft';
import { LegalPageDraft } from '../models/legal-page-draft';

// PHP reads a body only on POST, so a save names its real method inside it.
const PUT_OVER_POST = 'PUT';

/** Multipart, so the banner travels with the fields. The server wants 1 or 0 for the flag. */
export function toLiveAboutForm(draft: AboutPageDraft): FormData {
  const form = new FormData();
  form.set('_method', PUT_OVER_POST);
  form.set('title[ar]', draft.title);
  form.set('title[en]', draft.title);
  form.set('summary[ar]', draft.summary);
  form.set('summary[en]', draft.summary);
  form.set('phone', draft.phone);
  form.set('email', draft.email);
  form.set('address', draft.address);
  form.set('status', draft.status);
  form.set('isBannerRemoved', draft.isBannerRemoved ? '1' : '0');
  if (draft.banner) {
    form.set('banner', draft.banner);
  }
  return form;
}

export function toLiveLegalBody(draft: LegalPageDraft) {
  return {
    _method: PUT_OVER_POST,
    title: inBothLanguages(draft.title),
    body: inBothLanguages(draft.body),
    status: draft.status,
  };
}

export function toLiveContactBody({ title, introduction, ...contact }: ContactPageDraft) {
  return {
    _method: PUT_OVER_POST,
    title: inBothLanguages(title),
    introduction: inBothLanguages(introduction),
    ...contact,
  };
}

export function toLiveFaqBody(draft: FaqQuestionDraft) {
  return { question: inBothLanguages(draft.question), answer: inBothLanguages(draft.answer) };
}
