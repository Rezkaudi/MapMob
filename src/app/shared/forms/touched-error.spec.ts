import { FormControl, Validators } from '@angular/forms';
import { touchedError } from './touched-error';

describe('touchedError', () => {
  it('stays quiet until the field has been visited', () => {
    const control = new FormControl('', Validators.required);

    expect(touchedError(control, 'اكتب عنوان الصفحة')).toBeNull();

    control.markAsTouched();
    expect(touchedError(control, 'اكتب عنوان الصفحة')).toBe('اكتب عنوان الصفحة');
  });

  it('says nothing about a valid field', () => {
    const control = new FormControl('عن التطبيق', Validators.required);
    control.markAsTouched();

    expect(touchedError(control, 'اكتب عنوان الصفحة')).toBeNull();
  });
});
