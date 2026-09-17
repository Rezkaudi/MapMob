import { ContentPageKind } from '../models/content-page-kind';

export const CONTENT_URL = '/content';

/** Each page kind is also its route segment, e.g. `/content/about`. */
export function contentPageEditUrl(kind: ContentPageKind): string {
  return `${CONTENT_URL}/${kind}`;
}
