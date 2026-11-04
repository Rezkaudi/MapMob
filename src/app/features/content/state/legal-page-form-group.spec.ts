import { createLegalPageFormGroup, toLegalPageDraft } from './legal-page-form-group';

describe('createLegalPageFormGroup', () => {
  it('needs a title and a body with real text', () => {
    const form = createLegalPageFormGroup();

    form.setValue({ title: '   ', body: '' });
    expect(form.controls.title.invalid).toBe(true);
    expect(form.controls.body.invalid).toBe(true);

    form.setValue({ title: 'الشروط', body: '<p>نص</p>' });
    expect(form.valid).toBe(true);
  });

  it('turns the form into what is saved, with a trimmed title', () => {
    const form = createLegalPageFormGroup();
    form.setValue({ title: '  الشروط  ', body: '<p>نص</p>' });

    expect(toLegalPageDraft(form.getRawValue())).toEqual({
      title: 'الشروط',
      body: '<p>نص</p>',
    });
  });
});
