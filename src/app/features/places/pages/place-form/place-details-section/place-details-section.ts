import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldLabel } from '../../../../../shared/ui/field-label/field-label';
import { FormSection } from '../../../../../shared/ui/form-section/form-section';
import { PlaceFormGroup } from '../../../state/place-form-group';
import { PlaceFieldControl } from '../../../ui/place-field-control';

@Component({
  selector: 'app-place-details-section',
  imports: [FieldLabel, FormSection, PlaceFieldControl, ReactiveFormsModule],
  templateUrl: './place-details-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceDetailsSection {
  readonly form = input.required<PlaceFormGroup>();
}
