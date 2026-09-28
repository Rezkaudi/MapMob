import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PICTURE_RULES } from '../../files/picture-rules';
import { OfferFieldsForm } from '../../forms/offer-fields-form';
import { buildOfferFieldErrors } from '../../forms/offer-form-errors';
import { DateRange } from '../../models/date-range';
import { OfferItem } from '../../models/offer-item';
import { OfferScope } from '../../models/offer-scope';
import { FORM_CONTROL_CLASSES } from '../form-field/form-control-classes';
import { FormField } from '../form-field/form-field';
import { ImageUploadField } from '../image-upload-field/image-upload-field';
import { UploadedImage } from '../image-upload-field/uploaded-image';
import { AppIcon } from '../app-icon/app-icon';
import { OfferPeriodFields } from '../offer-period-fields/offer-period-fields';
import { OfferScopePicker } from '../offer-scope-picker/offer-scope-picker';

/**
 * The fields every offer form shares, in the frame's two-column grid. A page adds its own row
 * after the first pair by projecting it (the admin's place and category).
 */
@Component({
  selector: 'app-offer-form-fields',
  imports: [
    AppIcon,
    FormField,
    ImageUploadField,
    OfferPeriodFields,
    OfferScopePicker,
    ReactiveFormsModule,
  ],
  templateUrl: './offer-form-fields.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferFormFields {
  readonly form = input.required<OfferFieldsForm>();
  readonly items = input.required<readonly OfferItem[]>();
  readonly isItemsLoading = input<boolean>(false);
  readonly image = input<UploadedImage | null>(null);
  readonly imageChange = output<UploadedImage | null>();

  protected readonly controlClasses = FORM_CONTROL_CLASSES;
  protected readonly pictureRules = PICTURE_RULES;

  /** Goes up on every change of the form, even one the page makes, so OnPush follows it. */
  private readonly formChanges = signal(0);
  protected readonly errors = computed(() => {
    this.formChanges();
    return buildOfferFieldErrors(this.form());
  });
  protected readonly period = computed<DateRange>(() => {
    this.formChanges();
    const { startsOn, endsOn } = this.form().controls;
    return { from: startsOn.value, to: endsOn.value };
  });
  protected readonly scope = computed(() => {
    this.formChanges();
    return this.form().controls.scope.value;
  });
  protected readonly selectedItemIds = computed(() => {
    this.formChanges();
    return this.form().controls.itemIds.value;
  });

  constructor() {
    effect((onCleanup) => {
      const subscription = this.form().events.subscribe(() =>
        this.formChanges.update((count) => count + 1),
      );
      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected changePeriod(range: DateRange): void {
    const { startsOn, endsOn } = this.form().controls;
    startsOn.setValue(range.from);
    endsOn.setValue(range.to);
    startsOn.markAsTouched();
    endsOn.markAsTouched();
  }

  protected changeScope(scope: OfferScope): void {
    this.form().controls.scope.setValue(scope);
  }

  protected changeItems(itemIds: readonly string[]): void {
    const { itemIds: control } = this.form().controls;
    control.setValue(itemIds);
    control.markAsTouched();
  }
}
