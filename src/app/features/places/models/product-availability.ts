/** How the status field and the table badge name each state. */
export const PRODUCT_AVAILABILITY_LABELS = {
  available: 'متاح',
  unavailable: 'غير متاح',
} as const;

export const PRODUCT_AVAILABILITY_CHOICES = [
  { value: 'available', label: PRODUCT_AVAILABILITY_LABELS.available, isAvailable: true },
  { value: 'unavailable', label: PRODUCT_AVAILABILITY_LABELS.unavailable, isAvailable: false },
] as const;

export function availabilityValue(isAvailable: boolean): string {
  return isAvailable ? 'available' : 'unavailable';
}
