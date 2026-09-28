import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreFieldErrors } from '../../state/store-field-errors';
import { StoreProfileFormGroup } from '../../state/store-profile-form-group';
import { StoreCard } from '../store-card/store-card';
import { StoreField } from '../store-field/store-field';
import { StoreInput } from '../store-input/store-input';

@Component({
  selector: 'app-store-contact-card',
  imports: [ReactiveFormsModule, StoreCard, StoreField, StoreInput],
  templateUrl: './store-contact-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreContactCard {
  readonly form = input.required<StoreProfileFormGroup>();
  readonly errors = input.required<StoreFieldErrors>();
}
