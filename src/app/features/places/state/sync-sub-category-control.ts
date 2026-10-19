import { FormControl } from '@angular/forms';

/** With no sub categories to pick, the field is off and holds nothing. */
export function syncSubCategoryControl(
  control: FormControl<string>,
  subCategories: readonly string[],
): void {
  if (!subCategories.includes(control.value)) {
    control.setValue('');
  }
  if (subCategories.length === 0) {
    control.disable({ emitEvent: false });
    return;
  }
  control.enable({ emitEvent: false });
}
