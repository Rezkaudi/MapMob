/** A report that is still waiting for an admin to accept or reject it. */
export interface ReviewReport {
  readonly reporterName: string;
  readonly reason: string;
  readonly notes: string;
}
