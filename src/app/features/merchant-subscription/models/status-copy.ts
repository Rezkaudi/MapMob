export type StatusTone = 'success' | 'warning' | 'muted';

export interface StatusCopy {
  readonly label: string;
  readonly tone: StatusTone;
}
