import { AboutPageDraft } from '../models/about-page-draft';
import { toAboutPageFormData } from './about-page-form-data';

const DRAFT: AboutPageDraft = {
  title: 'عن التطبيق',
  summary: '<p>نبذة</p>',
  phone: '+963 933 123 456',
  email: 'contact@mapmob.app',
  address: 'طرطوس',
  banner: null,
  isBannerRemoved: true,
  status: 'draft',
};

describe('toAboutPageFormData', () => {
  it('writes every field', () => {
    const data = toAboutPageFormData(DRAFT);

    expect(data.get('title')).toBe('عن التطبيق');
    expect(data.get('summary')).toBe('<p>نبذة</p>');
    expect(data.get('phone')).toBe('+963 933 123 456');
    expect(data.get('email')).toBe('contact@mapmob.app');
    expect(data.get('address')).toBe('طرطوس');
    expect(data.get('isBannerRemoved')).toBe('true');
    expect(data.get('status')).toBe('draft');
    expect(data.has('banner')).toBe(false);
  });

  it('attaches a newly picked banner', () => {
    const banner = new File(['png'], 'banner.png', { type: 'image/png' });

    const data = toAboutPageFormData({ ...DRAFT, banner, isBannerRemoved: false });

    expect((data.get('banner') as File).name).toBe('banner.png');
  });
});
