import {
  createProviderJoinPageFormGroup,
  toProviderJoinPageDraft,
} from './provider-join-page-form-group';

describe('createProviderJoinPageFormGroup', () => {
  it('needs a title and a full web address for the form link', () => {
    const form = createProviderJoinPageFormGroup();

    form.setValue({ title: '   ', registrationFormUrl: '' });
    expect(form.controls.title.invalid).toBe(true);
    expect(form.controls.registrationFormUrl.invalid).toBe(true);

    form.setValue({ title: 'انضم إلينا', registrationFormUrl: 'docs.google.com/forms' });
    expect(form.controls.registrationFormUrl.invalid).toBe(true);

    form.setValue({ title: 'انضم إلينا', registrationFormUrl: 'https://docs.google.com/forms' });
    expect(form.valid).toBe(true);
  });

  it('publishes the form as a draft with both fields trimmed', () => {
    const form = createProviderJoinPageFormGroup();
    form.setValue({ title: '  انضم إلينا ', registrationFormUrl: ' https://forms.app/join ' });

    expect(toProviderJoinPageDraft(form.getRawValue())).toEqual({
      title: 'انضم إلينا',
      registrationFormUrl: 'https://forms.app/join',
      status: 'published',
    });
  });
});
