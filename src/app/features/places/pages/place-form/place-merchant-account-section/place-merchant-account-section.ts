import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldLabel } from '../../../../../shared/ui/field-label/field-label';
import { FormSection } from '../../../../../shared/ui/form-section/form-section';
import { PlaceFormGroup } from '../../../state/place-form-group';
import { PlaceFieldControl } from '../../../ui/place-field-control';
import { PlaceOwnerPasswordField } from './place-owner-password-field/place-owner-password-field';

/** The merchant's sign-in for their own dashboard, made with the place. */
@Component({
  selector: 'app-place-merchant-account-section',
  imports: [
    FieldLabel,
    FormSection,
    PlaceFieldControl,
    PlaceOwnerPasswordField,
    ReactiveFormsModule,
  ],
  templateUrl: './place-merchant-account-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceMerchantAccountSection {
  readonly form = input.required<PlaceFormGroup>();
  /** An edit keeps the saved password, so the password is no longer required. */
  readonly isEditing = input<boolean>(false);
}
