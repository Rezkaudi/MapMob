import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldLabel } from '../../../../../shared/ui/field-label/field-label';
import { FormSection } from '../../../../../shared/ui/form-section/form-section';
import { PlaceFormGroup } from '../../../state/place-form-group';
import { PlaceFieldControl } from '../../../ui/place-field-control';
import { PlaceSelectFrame } from '../../../ui/place-select-frame/place-select-frame';

@Component({
  selector: 'app-place-basic-info-section',
  imports: [FieldLabel, FormSection, PlaceFieldControl, PlaceSelectFrame, ReactiveFormsModule],
  templateUrl: './place-basic-info-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceBasicInfoSection {
  readonly form = input.required<PlaceFormGroup>();
  readonly categories = input.required<readonly string[]>();
}
