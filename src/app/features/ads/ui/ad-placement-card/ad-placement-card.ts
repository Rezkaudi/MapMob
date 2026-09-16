import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FormCard } from '../../../../shared/ui/form-card/form-card';
import { FORM_CONTROL_CLASSES } from '../../../../shared/ui/form-field/form-control-classes';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { AdFormGroup } from '../../state/ad-form-group';
import { PLACEMENT_OPTIONS, POSITION_OPTIONS } from '../ad-form-choices';

@Component({
  selector: 'app-ad-placement-card',
  imports: [AppIcon, FormCard, FormField, ReactiveFormsModule],
  templateUrl: './ad-placement-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdPlacementCard {
  readonly form = input.required<AdFormGroup>();

  protected readonly placementOptions = PLACEMENT_OPTIONS;
  protected readonly positionOptions = POSITION_OPTIONS;
  protected readonly controlClasses = FORM_CONTROL_CLASSES;
}
