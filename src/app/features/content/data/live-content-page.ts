import { ContentPageStatus } from '../models/content-page-status';

/** What every page of `/admin/content/pages/{kind}` carries. The title comes in one language. */
export interface LiveContentPage {
  readonly title: string;
  readonly status: ContentPageStatus;
  readonly updatedAt: string;
}
