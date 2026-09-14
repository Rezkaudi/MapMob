export type ConfirmActionTone = 'success' | 'danger';

export interface ConfirmActionCopy {
  readonly title: string;
  readonly question: string;
  readonly detail: string;
  readonly confirmLabel: string;
  readonly tone: ConfirmActionTone;
}
