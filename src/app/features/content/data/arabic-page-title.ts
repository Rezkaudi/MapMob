import { ContentPageKind } from '../models/content-page-kind';
import { CONTENT_PAGE_NAMES } from '../state/content-page-names';

const ARABIC_LETTER = /[؀-ۿ]/;

/**
 * The server can send an English title ("About The App") or, for a page it has just made,
 * the page's own word ("provider-join"). The panel is Arabic, so those fall back to the page name.
 */
export function toArabicPageTitle(kind: ContentPageKind, title: string): string {
  return ARABIC_LETTER.test(title) ? title : CONTENT_PAGE_NAMES[kind];
}
