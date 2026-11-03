import { findFirstInvalidField } from './find-first-invalid-field';

function buildForm(html: string): HTMLFormElement {
  const form = document.createElement('form');
  form.innerHTML = html;
  return form;
}

describe('findFirstInvalidField', () => {
  it('returns null when every field is valid', () => {
    const form = buildForm('<input class="ng-valid" /><select class="ng-valid"></select>');
    expect(findFirstInvalidField(form)).toBeNull();
  });

  it('returns the first invalid input in page order', () => {
    const form = buildForm(
      '<input id="name" class="ng-valid" /><textarea id="about" class="ng-invalid"></textarea><input id="phone" class="ng-invalid" />',
    );
    expect(findFirstInvalidField(form)?.id).toBe('about');
  });

  it('finds a custom control by its form control name', () => {
    const form = buildForm(
      '<app-image-upload-field id="cover" formcontrolname="cover" class="ng-invalid"></app-image-upload-field>',
    );
    expect(findFirstInvalidField(form)?.id).toBe('cover');
  });

  it('finds a field marked with aria-invalid', () => {
    const form = buildForm(
      '<input id="code" aria-invalid="false" /><input id="link" aria-invalid="true" />',
    );
    expect(findFirstInvalidField(form)?.id).toBe('link');
  });

  it('skips invalid groups and only returns the field inside', () => {
    const form = buildForm(
      '<div formgroupname="address" class="ng-invalid"><input id="street" class="ng-invalid" /></div>',
    );
    expect(findFirstInvalidField(form)?.id).toBe('street');
  });
});
