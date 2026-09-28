import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AUTH_FIELD_BOX_CLASSES,
  AUTH_FIELD_INPUT_CLASSES,
  AUTH_FIELD_LABEL_CLASSES,
} from '../auth-field-classes';

@Component({
  selector: 'app-auth-text-field',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-text-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthTextField {
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly placeholder = input<string>('');
  readonly type = input<'email' | 'text'>('email');
  readonly autocomplete = input<string>('email');

  protected readonly boxClasses = AUTH_FIELD_BOX_CLASSES;
  protected readonly inputClasses = AUTH_FIELD_INPUT_CLASSES;
  protected readonly labelClasses = AUTH_FIELD_LABEL_CLASSES;
}
