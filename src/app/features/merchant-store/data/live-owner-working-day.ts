/** One day of the /owner store; `day` counts from 0 = Sunday, like JavaScript. */
export interface LiveOwnerWorkingDay {
  readonly day: number;
  readonly isOpen: boolean;
  readonly openTime: string | null;
  readonly closeTime: string | null;
}
