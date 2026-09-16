import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FormCard } from '../../../../shared/ui/form-card/form-card';
import { FORM_CONTROL_CLASSES } from '../../../../shared/ui/form-field/form-control-classes';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { OptionCard } from '../../../../shared/ui/option-card/option-card';
import { AdAdvertiserType } from '../../models/ad-advertiser-type';
import { AdFormPlace } from '../../models/ad-form-options';
import { AdFormErrors } from '../../state/ad-form-errors';
import { AdFormGroup } from '../../state/ad-form-group';
import { ADVERTISER_TYPE_CARDS } from '../ad-form-choices';

@Component({
  selector: 'app-ad-basic-info-card',
  imports: [AppIcon, FormCard, FormField, OptionCard, ReactiveFormsModule],
  templateUrl: './ad-basic-info-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdBasicInfoCard {
  readonly form = input.required<AdFormGroup>();
  readonly places = input.required<readonly AdFormPlace[]>();
  readonly errors = input.required<AdFormErrors>();

  protected readonly advertiserTypeCards = ADVERTISER_TYPE_CARDS;
  protected readonly controlClasses = FORM_CONTROL_CLASSES;

  protected pickAdvertiserType(advertiserType: AdAdvertiserType): void {
    this.form().controls.advertiserType.setValue(advertiserType);
  }
}
