export type ActionItemTone = 'error' | 'warning' | 'info' | 'success';

export interface ActionItem {
  readonly id: string;
  readonly label: string;
  readonly count: number;
  readonly tone: ActionItemTone;
}
