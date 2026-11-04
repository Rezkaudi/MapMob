/** What every page of `/admin/content/pages/{kind}` carries. The title comes in one language. */
export interface LiveContentPage {
  readonly title: string;
  /** "published", or "draft" for a page saved before the panel stopped making drafts. */
  readonly status: string;
  readonly updatedAt: string;
}
