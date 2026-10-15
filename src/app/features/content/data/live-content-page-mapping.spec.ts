import {
  toAboutPage,
  toContactPage,
  toContentPage,
  toLegalPage,
} from './live-content-page-mapping';

const SAVED_AT = '2026-10-15T18:09:59+00:00';

describe('live content page mapping', () => {
  it('turns a saved page into its table row', () => {
    expect(
      toContentPage('terms', { title: 'الشروط', status: 'draft', updatedAt: SAVED_AT }),
    ).toEqual({ kind: 'terms', title: 'الشروط', updatedOn: '2026-10-15', status: 'draft' });
  });

  it('reads the about page, with empty text for what was never saved', () => {
    expect(
      toAboutPage({
        title: 'عن التطبيق',
        status: 'published',
        updatedAt: SAVED_AT,
        bannerUrl: null,
        summary: '<p>دليلك</p>',
        phone: null,
        email: 'info@mapmob.com',
        address: null,
      }),
    ).toEqual({
      title: 'عن التطبيق',
      bannerUrl: null,
      summary: '<p>دليلك</p>',
      phone: '',
      email: 'info@mapmob.com',
      address: '',
    });
  });

  it('reads a legal page that has no text yet', () => {
    expect(
      toLegalPage({ title: 'privacy', status: 'draft', updatedAt: SAVED_AT, body: null }),
    ).toEqual({ title: 'privacy', body: '' });
  });

  it('reads the contact page', () => {
    const contact = toContactPage({
      title: 'تواصل معنا',
      status: 'published',
      updatedAt: SAVED_AT,
      introduction: '<p>نحن هنا</p>',
      supportPhone: '0936318327',
      supportEmail: 'support@mapmob.com',
      facebookUrl: null,
      instagramUrl: 'https://instagram.com/mapmob',
      telegramUrl: null,
      whatsappUrl: null,
    });

    expect(contact.introduction).toBe('<p>نحن هنا</p>');
    expect(contact.facebookUrl).toBe('');
    expect(contact.instagramUrl).toBe('https://instagram.com/mapmob');
  });
});
