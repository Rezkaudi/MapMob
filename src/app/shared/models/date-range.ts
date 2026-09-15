/** Calendar days written `yyyy-mm-dd`; `null` leaves that end open. */
export interface DateRange {
  readonly from: string | null;
  readonly to: string | null;
}
