export interface CategoryFormCopy {
  readonly title: string;
  /** Left empty on the edit dialog, which has no subtitle in the design. */
  readonly description: string;
  readonly badgeIcon: string;
  readonly parentLabel: string;
  readonly submitLabel: string;
}
