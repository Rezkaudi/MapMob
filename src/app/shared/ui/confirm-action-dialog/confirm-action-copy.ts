import { ConfirmActionContext } from './confirm-action-context';
import { ConfirmActionIcon } from './confirm-action-icon';

export type ConfirmActionTone = 'success' | 'danger' | 'warning' | 'critical';

/** How the third line reads: muted grey, the tone's own colour, or a red warning box. */
export type ConfirmDetailAppearance = 'muted' | 'toned' | 'callout';

export interface ConfirmActionCopy {
  readonly title: string;
  readonly question: string;
  /** Left out by the dialogs that end on their context card. */
  readonly detail?: string;
  readonly confirmLabel: string;
  readonly tone: ConfirmActionTone;
  readonly detailAppearance?: ConfirmDetailAppearance;
  readonly context?: ConfirmActionContext;
  readonly icon?: ConfirmActionIcon;
}
