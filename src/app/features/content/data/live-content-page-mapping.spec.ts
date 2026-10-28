import {
  toAboutPage,
  toContactPage,
  toContentPage,
  toLegalPage,
  toProviderJoinPage,
} from './live-content-page-mapping';

const SAVED_AT = '2026-10-15T18:09:59+00:00';

describe('live content page mapping', () => {
  it('turns a saved page into its table row', () => {
    expect(
      toContentPage('terms', { title: 'الشروط', status: 'draft', updatedAt: SAVED_AT }),
    ).toEqual({ kind: 'terms', title: 'الشروط', updatedOn: '2026-10-15', status: 'draft' });
  });

  it('shows the Arabic page name when the server sends a title with no Arabic in it', () => {
    const row = (kind: 'about' | 'contact' | 'provider-join', title: string) =>
      toContentPage(kind, { title, status: 'published', updatedAt: SAVED_AT }).title;

    expect(row('about', 'About The App')).toBe('عن التطبيق');
    expect(row('contact', 'Contact Us')).toBe('تواصل معنا');
    expect(row('provider-join', 'provider-join')).toBe('انضم إلينا كمقدم خدمة');
    expect(row('about', 'من نحن')).toBe('من نحن');
  });

  it('opens each editor with the Arabic name in place of an English title', () => {
    const meta = { status: 'published' as const, updatedAt: SAVED_AT };

    expect(toLegalPage('privacy', { ...meta, title: 'Privacy Policy', body: null }).title).toBe(
      'سياسة الخصوصية',
    );
    expect(
      toProviderJoinPage({ ...meta, title: 'provider-join', registrationFormUrl: null }).title,
    ).toBe('انضم إلينا كمقدم خدمة');
    expect(
      toAboutPage({
        ...meta,
        title: 'About The App',
        bannerUrl: null,
        summary: null,
        phone: null,
        email: null,
        address: null,
      }).title,
    ).toBe('عن التطبيق');
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
      toLegalPage('privacy', {
        title: 'سياسة الخصوصية',
        status: 'draft',
        updatedAt: SAVED_AT,
        body: null,
      }),
    ).toEqual({ title: 'سياسة الخصوصية', body: '' });
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

  it('reads the join page, with an empty link when none was saved', () => {
    expect(
      toProviderJoinPage({
        title: 'انضم إلينا كمقدم خدمة',
        status: 'published',
        updatedAt: SAVED_AT,
        registrationFormUrl: null,
      }),
    ).toEqual({ title: 'انضم إلينا كمقدم خدمة', registrationFormUrl: '' });
  });

  it('takes the link from body when the server has no link field', () => {
    expect(
      toProviderJoinPage({
        title: 'انضم إلينا كمقدم خدمة',
        status: 'published',
        updatedAt: SAVED_AT,
        body: 'https://forms.app/join',
      }).registrationFormUrl,
    ).toBe('https://forms.app/join');
  });
});
