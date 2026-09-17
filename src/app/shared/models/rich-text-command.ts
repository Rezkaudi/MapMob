/** Everything the rich text toolbar can ask the editor to do. */
export type RichTextCommand =
  | 'undo'
  | 'redo'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'paragraph'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'bulletList'
  | 'numberedList'
  | 'link'
  | 'alignRight'
  | 'alignCenter'
  | 'alignLeft'
  | 'justify'
  | 'clearFormat';
