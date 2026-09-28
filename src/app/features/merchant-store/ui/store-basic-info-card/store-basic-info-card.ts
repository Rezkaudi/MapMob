import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreFieldErrors } from '../../state/store-field-errors';
import { StoreProfileFormGroup } from '../../state/store-profile-form-group';
import { StoreCard } from '../store-card/store-card';
import { StoreCoverPicker } from '../store-cover-picker/store-cover-picker';
import { StoreField } from '../store-field/store-field';
import { StoreInput } from '../store-input/store-input';

const NAME_ICON_SIZE_PX = 17;

@Component({
  selector: 'app-store-basic-info-card',
  imports: [ReactiveFormsModule, StoreCard, StoreCoverPicker, StoreField, StoreInput],
  templateUrl: './store-basic-info-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreBasicInfoCard {
  readonly form = input.required<StoreProfileFormGroup>();
  readonly coverImageUrl = input.required<string | null>();
  readonly errors = input.required<StoreFieldErrors>();
  readonly descriptionCounter = input.required<string>();
  readonly coverPicked = output<File>();

  protected readonly nameIconSize = NAME_ICON_SIZE_PX;
}
