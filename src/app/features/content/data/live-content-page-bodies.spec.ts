import { buildContactPage } from '../testing/content-fixture';
import {
  toLiveAboutForm,
  toLiveContactBody,
  toLiveFaqBody,
  toLiveLegalBody,
} from './live-content-page-bodies';

describe('live content page bodies', () => {
  it('sends the about page as multipart with both languages and PUT inside the POST', () => {
    const banner = new File(['x'], 'banner.png', { type: 'image/png' });

    const form = toLiveAboutForm({
      title: 'عن التطبيق',
      summary: '<p>دليلك</p>',
      phone: '0936318327',
      email: 'info@mapmob.com',
      address: 'طرطوس',
      status: 'published',
      banner,
      isBannerRemoved: false,
    });

    expect(form.get('_method')).toBe('PUT');
    expect([form.get('title[ar]'), form.get('title[en]')]).toEqual(['عن التطبيق', 'عن التطبيق']);
    expect([form.get('summary[ar]'), form.get('summary[en]')]).toEqual([
      '<p>دليلك</p>',
      '<p>دليلك</p>',
    ]);
    expect(form.get('banner')).toBeInstanceOf(File);
    expect(form.get('isBannerRemoved')).toBe('0');
  });

  it('says 1 when the admin removed the banner', () => {
    const form = toLiveAboutForm({
      title: 'x',
      summary: '',
      phone: '',
      email: '',
      address: '',
      status: 'draft',
      banner: null,
      isBannerRemoved: true,
    });

    expect(form.get('isBannerRemoved')).toBe('1');
    expect(form.has('banner')).toBe(false);
  });

  it('sends a legal page as JSON with both languages', () => {
    expect(toLiveLegalBody({ title: 'الشروط', body: '<p>نص</p>', status: 'draft' })).toEqual({
      _method: 'PUT',
      title: { ar: 'الشروط', en: 'الشروط' },
      body: { ar: '<p>نص</p>', en: '<p>نص</p>' },
      status: 'draft',
    });
  });

  it('sends the contact page as JSON with the introduction in both languages', () => {
    const body = toLiveContactBody({ ...buildContactPage(), status: 'published' });

    expect(body._method).toBe('PUT');
    expect(body.title).toEqual({ ar: 'تواصل معنا', en: 'تواصل معنا' });
    expect(body.introduction.ar).toBe(body.introduction.en);
    expect(body.supportPhone).toBe(buildContactPage().supportPhone);
  });

  it('sends a question and its answer in both languages', () => {
    expect(toLiveFaqBody({ question: 'كيف؟', answer: '<p>هكذا</p>' })).toEqual({
      question: { ar: 'كيف؟', en: 'كيف؟' },
      answer: { ar: '<p>هكذا</p>', en: '<p>هكذا</p>' },
    });
  });
});
