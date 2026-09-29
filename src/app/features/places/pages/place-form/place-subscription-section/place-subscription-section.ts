import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldLabel } from '../../../../../shared/ui/field-label/field-label';
import { FormSection } from '../../../../../shared/ui/form-section/form-section';
import { PLACE_PACKAGE_LABEL, PlacePackage } from '../../../models/place-package';
import { PLACE_STATUS_LABEL, PlaceStatus } from '../../../models/place-status';
import { PlaceFormGroup } from '../../../state/place-form-group';
import { PlaceFieldControl } from '../../../ui/place-field-control';
import { PlaceSelectFrame } from '../../../ui/place-select-frame/place-select-frame';

const PACKAGE_OPTIONS = (Object.keys(PLACE_PACKAGE_LABEL) as PlacePackage[]).map((value) => ({
  value,
  label: PLACE_PACKAGE_LABEL[value],
}));
const STATUS_OPTIONS = (Object.keys(PLACE_STATUS_LABEL) as PlaceStatus[]).map((value) => ({
  value,
  label: PLACE_STATUS_LABEL[value],
}));

@Component({
  selector: 'app-place-subscription-section',
  imports: [FieldLabel, FormSection, PlaceFieldControl, PlaceSelectFrame, ReactiveFormsModule],
  templateUrl: './place-subscription-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceSubscriptionSection {
  readonly form = input.required<PlaceFormGroup>();

  protected readonly packages = PACKAGE_OPTIONS;
  protected readonly statuses = STATUS_OPTIONS;
}
