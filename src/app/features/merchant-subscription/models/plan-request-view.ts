import { PlanChangeDraft } from './plan-change-draft';

export interface PlanRequestRow {
  readonly label: string;
  readonly value: string;
  /** The requested plan's name is drawn in blue. */
  readonly isHighlighted: boolean;
}

/** The upgrade and renewal dialogs: a grey summary box, then the review notice. */
export interface PlanRequestView {
  readonly title: string;
  readonly rows: readonly PlanRequestRow[];
  readonly draft: PlanChangeDraft;
}
