/** The fixed pages of the app that the content section edits. */
export type ContentPageKind = 'about' | 'terms' | 'privacy' | 'contact' | 'faq';

/** Pages that are only a title and one long text. */
export type LegalPageKind = Extract<ContentPageKind, 'terms' | 'privacy'>;
