export interface GovernorateActivity {
  readonly governorateName: string;
  readonly visitCount: number;
  /** A percentage from 0 to 100. */
  readonly share: number;
}
