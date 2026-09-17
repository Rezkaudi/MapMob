import { buildContactPage } from '../testing/content-fixture';
import { createContactPageFormGroup, toContactPageDraft } from './contact-page-form-group';

describe('createContactPageFormGroup', () => {
  it('accepts the saved contact page', () => {
    const form = createContactPageFormGroup();

    form.setValue(buildContactPage());

    expect(form.valid).toBe(true);
  });

  it('needs every field, a real phone and email, and web links', () => {
    const form = createContactPageFormGroup();
    form.setValue({
      ...buildContactPage(),
      introduction: ' ',
      supportPhone: 'هاتف',
      supportEmail: 'mapmob',
      facebookUrl: 'facebook.com/mapmobapp',
      whatsappUrl: '',
    });

    expect(form.controls.introduction.invalid).toBe(true);
    expect(form.controls.supportPhone.invalid).toBe(true);
    expect(form.controls.supportEmail.invalid).toBe(true);
    expect(form.controls.facebookUrl.invalid).toBe(true);
    expect(form.controls.whatsappUrl.invalid).toBe(true);
    expect(form.controls.telegramUrl.valid).toBe(true);
  });
});

describe('toContactPageDraft', () => {
  it('trims every field and adds the status', () => {
    const page = buildContactPage();

    const draft = toContactPageDraft(
      { ...page, title: ' تواصل معنا ', telegramUrl: ' https://t.me/x ' },
      'draft',
    );

    expect(draft).toEqual({ ...page, telegramUrl: 'https://t.me/x', status: 'draft' });
  });
});
