import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { webAddress } from '../../../shared/forms/contact-validators';

/** A switched-on platform needs its link; a switched-off one may leave it blank. */
function requiredWhenEnabled(control: AbstractControl<string>): ValidationErrors | null {
  const isEnabled = control.parent?.get('isEnabled')?.value === true;
  return isEnabled && control.value.trim() === '' ? { required: true } : null;
}

export function createDeliveryLinkGroup() {
  // isEnabled comes before storeUrl, so a reset has the switch in place when the link is checked.
  return new FormGroup({
    platformId: new FormControl('', { nonNullable: true }),
    isEnabled: new FormControl(false, { nonNullable: true }),
    storeUrl: new FormControl('', {
      nonNullable: true,
      validators: [requiredWhenEnabled, webAddress],
    }),
  });
}

export type DeliveryLinkFormGroup = ReturnType<typeof createDeliveryLinkGroup>;

export function setDeliveryLinkEnabled(link: DeliveryLinkFormGroup, isEnabled: boolean): void {
  link.controls.isEnabled.setValue(isEnabled);
  link.controls.storeUrl.updateValueAndValidity();
  link.markAsDirty();
}

/** A form array only takes values for the controls it has, so match the platform count first. */
export function resizeDeliveryLinks(links: FormArray<DeliveryLinkFormGroup>, count: number): void {
  while (links.length > count) {
    links.removeAt(links.length - 1, { emitEvent: false });
  }
  while (links.length < count) {
    links.push(createDeliveryLinkGroup(), { emitEvent: false });
  }
}
