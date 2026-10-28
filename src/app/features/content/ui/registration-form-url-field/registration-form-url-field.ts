import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WEB_ADDRESS_MESSAGE } from '../../../../shared/forms/contact-validators';
import { touchedError } from '../../../../shared/forms/touched-error';
import { ContentFieldLabel } from '../content-field-label/content-field-label';

/** "رابط نموذج التسجيل الخارجي": the outside form a new provider fills in. */
@Component({
  selector: 'app-registration-form-url-field',
  imports: [ContentFieldLabel, ReactiveFormsModule],
  templateUrl: './registration-form-url-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RegistrationFormUrlField {
  readonly control = input.required<FormControl<string>>();

  protected get error(): string | null {
    return touchedError(this.control(), WEB_ADDRESS_MESSAGE);
  }
}
