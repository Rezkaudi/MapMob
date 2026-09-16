import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FormCard } from '../../../../shared/ui/form-card/form-card';
import { FORM_CONTROL_CLASSES } from '../../../../shared/ui/form-field/form-control-classes';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { AdFormErrors } from '../../state/ad-form-errors';
import { AdFormGroup } from '../../state/ad-form-group';
import { AD_STATUS_OPTIONS, PRIORITY_OPTIONS } from '../ad-form-choices';

@Component({
  selector: 'app-ad-schedule-card',
  imports: [AppIcon, FormCard, FormField, ReactiveFormsModule],
  templateUrl: './ad-schedule-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdScheduleCard {
  readonly form = input.required<AdFormGroup>();
  readonly errors = input.required<AdFormErrors>();

  protected readonly priorityOptions = PRIORITY_OPTIONS;
  protected readonly statusOptions = AD_STATUS_OPTIONS;
  protected readonly controlClasses = FORM_CONTROL_CLASSES;

  protected toggleOngoing(event: Event): void {
    const isOngoing = (event.target as HTMLInputElement).checked;
    const { endsOn } = this.form().controls;
    if (isOngoing) {
      endsOn.setValue(null);
      endsOn.disable();
    } else {
      endsOn.enable();
    }
  }
}
