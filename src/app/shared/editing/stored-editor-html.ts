const TAG = /<[^>]*>/g;
const NON_BREAKING_SPACE = /&nbsp;/g;

/** A cleared editor still holds markup like `<p><br></p>`; store that as no text at all. */
export function toStoredEditorHtml(html: string): string {
  const text = html.replace(TAG, '').replace(NON_BREAKING_SPACE, ' ').trim();
  return text ? html : '';
}
