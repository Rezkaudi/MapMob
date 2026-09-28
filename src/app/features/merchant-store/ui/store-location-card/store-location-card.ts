import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { MapPicker } from '../../../../shared/ui/map-picker/map-picker';
import { MapPoint } from '../../../../shared/ui/map-picker/map-point';
import { NamedReference } from '../../models/named-reference';
import { StoreFieldErrors } from '../../state/store-field-errors';
import { StoreProfileFormGroup } from '../../state/store-profile-form-group';
import { StoreCard } from '../store-card/store-card';
import { StoreField } from '../store-field/store-field';
import { StoreInput } from '../store-input/store-input';

/** The governorate and area are an admin's to set; the owner edits the address and the pin. */
@Component({
  selector: 'app-store-location-card',
  imports: [AppIcon, MapPicker, ReactiveFormsModule, StoreCard, StoreField, StoreInput],
  templateUrl: './store-location-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreLocationCard {
  readonly form = input.required<StoreProfileFormGroup>();
  readonly governorate = input.required<NamedReference>();
  readonly area = input.required<NamedReference>();
  readonly errors = input.required<StoreFieldErrors>();
  readonly summary = input.required<string>();

  /** RTL: the governorate comes first, so it sits on the right. */
  protected readonly lockedPlaces = computed(() => [
    { label: 'المحافظة', value: this.governorate().name },
    { label: 'المنطقة', value: this.area().name },
  ]);

  protected movePin(point: MapPoint): void {
    this.form().patchValue(point);
    this.form().markAsDirty();
  }
}
