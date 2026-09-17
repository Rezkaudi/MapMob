import { toUploadedImage } from '../../../shared/ui/image-upload-field/uploaded-image-from-url';
import { buildAboutPage } from '../testing/content-fixture';
import {
  createAboutPageFormGroup,
  toAboutPageDraft,
  toAboutPageFormValue,
} from './about-page-form-group';

describe('createAboutPageFormGroup', () => {
  it('starts filled from the saved page', () => {
    const form = createAboutPageFormGroup();

    form.setValue(toAboutPageFormValue(buildAboutPage()));

    expect(form.valid).toBe(true);
    expect(form.controls.address.value).toBe('طرطوس، شارع الثورة');
  });

  it('needs every field, a phone number made of digits and a real email', () => {
    const form = createAboutPageFormGroup();
    form.setValue({ title: ' ', summary: '', phone: 'رقم', email: 'mapmob', address: '' });

    expect(form.controls.title.invalid).toBe(true);
    expect(form.controls.summary.invalid).toBe(true);
    expect(form.controls.phone.invalid).toBe(true);
    expect(form.controls.email.invalid).toBe(true);
    expect(form.controls.address.invalid).toBe(true);

    form.controls.phone.setValue('+963 933 123 456');
    form.controls.email.setValue('contact@mapmob.app');
    expect(form.controls.phone.valid).toBe(true);
    expect(form.controls.email.valid).toBe(true);
  });
});

describe('toAboutPageDraft', () => {
  const value = toAboutPageFormValue(buildAboutPage({ title: '  عن التطبيق  ' }));

  it('trims the text fields and keeps a saved banner untouched', () => {
    const draft = toAboutPageDraft(value, {
      banner: toUploadedImage('assets/images/about-app-banner.png'),
      hadSavedBanner: true,
      status: 'published',
    });

    expect(draft).toEqual({
      title: 'عن التطبيق',
      summary: buildAboutPage().summary,
      phone: '+963 933 123 456',
      email: 'contact@mapmob.app',
      address: 'طرطوس، شارع الثورة',
      banner: null,
      isBannerRemoved: false,
      status: 'published',
    });
  });

  it('sends a newly picked banner', () => {
    const file = new File(['png'], 'banner.png', { type: 'image/png' });
    const banner = {
      file,
      name: 'banner.png',
      previewUrl: 'blob:1',
      sizeInBytes: 3,
      width: null,
      height: null,
    };

    const draft = toAboutPageDraft(value, { banner, hadSavedBanner: true, status: 'draft' });

    expect(draft.banner).toBe(file);
    expect(draft.isBannerRemoved).toBe(false);
  });

  it('removes the saved banner when it was deleted', () => {
    const draft = toAboutPageDraft(value, {
      banner: null,
      hadSavedBanner: true,
      status: 'published',
    });

    expect(draft.isBannerRemoved).toBe(true);
  });
});
