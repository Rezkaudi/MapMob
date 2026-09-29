import { PlanChangeDraft } from './plan-change-draft';

export interface PlanLimitComparisonRow {
  readonly label: string;
  readonly value: string;
  /** A limit of 0: "0 (غير متاحة)" in grey. */
  readonly isUnavailable: boolean;
}

export interface PlanLimitColumn {
  readonly name: string;
  readonly rows: readonly PlanLimitComparisonRow[];
}

/** The "الانتقال إلى …" dialog: two plans side by side and a warning. */
export interface PlanDowngradeView {
  readonly title: string;
  readonly description: string;
  readonly current: PlanLimitColumn;
  readonly target: PlanLimitColumn;
  readonly warning: string;
  readonly confirmLabel: string;
  readonly draft: PlanChangeDraft;
}
