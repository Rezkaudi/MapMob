export type ConfirmActionTone = 'success' | 'danger' | 'warning' | 'critical';

/** How the third line reads: muted grey, the tone's own colour, or a red warning box. */
export type ConfirmDetailAppearance = 'muted' | 'toned' | 'callout';

export interface ConfirmActionCopy {
  readonly title: string;
  readonly question: string;
  readonly detail: string;
  readonly confirmLabel: string;
  readonly tone: ConfirmActionTone;
  readonly detailAppearance?: ConfirmDetailAppearance;
}
