import { RichTextCommand } from '../models/rich-text-command';

/** One call to the browser's editing commands. */
export interface EditingStep {
  readonly name: string;
  readonly value?: string;
}

/** A link needs an address first, so the editor builds that step itself. */
type DirectCommand = Exclude<RichTextCommand, 'link'>;

const EDITING_STEPS: Record<DirectCommand, EditingStep> = {
  undo: { name: 'undo' },
  redo: { name: 'redo' },
  heading1: { name: 'formatBlock', value: '<h1>' },
  heading2: { name: 'formatBlock', value: '<h2>' },
  heading3: { name: 'formatBlock', value: '<h3>' },
  paragraph: { name: 'formatBlock', value: '<p>' },
  bold: { name: 'bold' },
  italic: { name: 'italic' },
  underline: { name: 'underline' },
  bulletList: { name: 'insertUnorderedList' },
  numberedList: { name: 'insertOrderedList' },
  alignRight: { name: 'justifyRight' },
  alignCenter: { name: 'justifyCenter' },
  alignLeft: { name: 'justifyLeft' },
  justify: { name: 'justifyFull' },
  clearFormat: { name: 'removeFormat' },
};

export function editingStepFor(command: DirectCommand): EditingStep {
  return EDITING_STEPS[command];
}
