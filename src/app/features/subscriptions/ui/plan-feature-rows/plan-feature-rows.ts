import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The editable list of selling points under "المزايا التسويقية والتشغيلية للباقة". */
@Component({
  selector: 'app-plan-feature-rows',
  imports: [AppIcon, ReactiveFormsModule],
  templateUrl: './plan-feature-rows.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanFeatureRows {
  readonly features = input.required<FormArray<FormControl<string>>>();

  protected addFeature(): void {
    this.features().push(new FormControl('', { nonNullable: true }));
  }

  protected removeFeature(index: number): void {
    this.features().removeAt(index);
  }
}
