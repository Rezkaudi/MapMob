import { RichTextCommand } from './rich-text-command';

export type RichTextBlock = Extract<RichTextCommand, 'heading1' | 'heading2' | 'heading3' | 'paragraph'>;
export type RichTextAlignment = Extract<
  RichTextCommand,
  'alignRight' | 'alignCenter' | 'alignLeft' | 'justify'
>;

/** The formatting at the cursor, which the toolbar shows as pressed buttons. */
export interface RichTextState {
  readonly block: RichTextBlock;
  readonly isBold: boolean;
  readonly isItalic: boolean;
  readonly isUnderline: boolean;
  readonly isBulletList: boolean;
  readonly isNumberedList: boolean;
  readonly alignment: RichTextAlignment;
}

export const EMPTY_RICH_TEXT_STATE: RichTextState = {
  block: 'paragraph',
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isBulletList: false,
  isNumberedList: false,
  alignment: 'alignRight',
};
