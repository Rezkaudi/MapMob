interface LiveReportPerson {
  readonly id: number | null;
  readonly name: string | null;
}

export interface LiveReport {
  readonly id: number;
  readonly user: LiveReportPerson & {
    readonly email: string | null;
    readonly phone: string | null;
  };
  readonly store: { readonly id: number; readonly name: string };
  readonly reason: string;
  readonly description: string | null;
  readonly status: string;
  readonly admin_notes: string | null;
  readonly resolver: LiveReportPerson;
  readonly resolved_at: string | null;
  readonly images: readonly { readonly id: number; readonly image: string }[];
  readonly created_at: string;
  readonly updated_at: string;
}
