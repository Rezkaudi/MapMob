import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DeliveryLinkRow } from '../../models/delivery-link-row';
import { setDeliveryLinkEnabled } from '../../../../shared/forms/delivery-link-form';
import { StoreProfileFormGroup } from '../../state/store-profile-form-group';
import { DeliveryPlatformItem } from '../delivery-platform-item/delivery-platform-item';
import { StoreCard } from '../store-card/store-card';

@Component({
  selector: 'app-store-delivery-card',
  imports: [DeliveryPlatformItem, StoreCard],
  templateUrl: './store-delivery-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDeliveryCard {
  readonly form = input.required<StoreProfileFormGroup>();
  readonly rows = input.required<readonly DeliveryLinkRow[]>();

  protected setEnabled(index: number, isEnabled: boolean): void {
    const form = this.form();
    setDeliveryLinkEnabled(form.controls.deliveryLinks.at(index), isEnabled);
    form.markAsDirty();
  }
}
