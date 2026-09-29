import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { DeliveryPlatform } from '../models/delivery-platform';
import { WEB_ADDRESS_MESSAGE, webAddress } from './contact-validators';

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

/** Nothing until the field is touched; then a missing link first, a malformed one second. */
export function findDeliveryLinkError(
  storeUrl: FormControl<string>,
  missingMessage: string,
): string | null {
  if (!storeUrl.touched || storeUrl.valid) {
    return null;
  }
  return storeUrl.hasError('required') ? missingMessage : WEB_ADDRESS_MESSAGE;
}

/** One switched-off row per platform, as a place that never linked any app starts. */
export function resetDeliveryLinks(
  links: FormArray<DeliveryLinkFormGroup>,
  platforms: readonly DeliveryPlatform[],
): void {
  resizeDeliveryLinks(links, platforms.length);
  links.reset(
    platforms.map((platform) => ({ platformId: platform.id, isEnabled: false, storeUrl: '' })),
  );
}
