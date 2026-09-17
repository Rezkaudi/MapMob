import { RichTextCommand } from '../models/rich-text-command';
import { RichTextAlignment, RichTextBlock, RichTextState } from '../models/rich-text-state';
import { EditingCommandRunner } from './editing-command-runner';

const BLOCK_BY_TAG: Readonly<Record<string, RichTextBlock>> = {
  h1: 'heading1',
  h2: 'heading2',
  h3: 'heading3',
};

/** Right comes last: text with no alignment set reads right-aligned in RTL. */
const ALIGNMENT_COMMANDS: readonly (readonly [string, RichTextAlignment])[] = [
  ['justifyCenter', 'alignCenter'],
  ['justifyLeft', 'alignLeft'],
  ['justifyFull', 'justify'],
];

export function readRichTextState(runner: EditingCommandRunner): RichTextState {
  const alignment = ALIGNMENT_COMMANDS.find(([name]) => runner.isActive(name));
  return {
    block: BLOCK_BY_TAG[runner.valueOf('formatBlock').toLowerCase()] ?? 'paragraph',
    isBold: runner.isActive('bold'),
    isItalic: runner.isActive('italic'),
    isUnderline: runner.isActive('underline'),
    isBulletList: runner.isActive('insertUnorderedList'),
    isNumberedList: runner.isActive('insertOrderedList'),
    alignment: alignment?.[1] ?? 'alignRight',
  };
}

export function isRichTextCommandActive(command: RichTextCommand, state: RichTextState): boolean {
  switch (command) {
    case 'bold':
      return state.isBold;
    case 'italic':
      return state.isItalic;
    case 'underline':
      return state.isUnderline;
    case 'bulletList':
      return state.isBulletList;
    case 'numberedList':
      return state.isNumberedList;
    default:
      return command === state.block || command === state.alignment;
  }
}
