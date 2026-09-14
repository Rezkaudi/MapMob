export type RegionConfirmTone = 'success' | 'danger';

export interface RegionConfirmCopy {
  readonly title: string;
  readonly question: string;
  readonly detail: string;
  readonly confirmLabel: string;
  readonly tone: RegionConfirmTone;
}
