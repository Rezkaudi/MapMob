import { EditingCommandRunner } from './editing-command-runner';
import { isRichTextCommandActive, readRichTextState } from './read-rich-text-state';

function fakeRunner(activeNames: string[], blockValue: string): EditingCommandRunner {
  return {
    run: () => undefined,
    isActive: (name: string) => activeNames.includes(name),
    valueOf: () => blockValue,
  } as unknown as EditingCommandRunner;
}

describe('readRichTextState', () => {
  it('reads the block, inline marks, lists and alignment at the cursor', () => {
    const state = readRichTextState(
      fakeRunner(['bold', 'underline', 'insertOrderedList', 'justifyCenter'], 'H2'),
    );

    expect(state).toEqual({
      block: 'heading2',
      isBold: true,
      isItalic: false,
      isUnderline: true,
      isBulletList: false,
      isNumberedList: true,
      alignment: 'alignCenter',
    });
  });

  it('treats plain text as a right-aligned paragraph, the RTL default', () => {
    const state = readRichTextState(fakeRunner([], 'div'));

    expect(state.block).toBe('paragraph');
    expect(state.alignment).toBe('alignRight');
  });
});

describe('isRichTextCommandActive', () => {
  const state = readRichTextState(
    fakeRunner(['italic', 'insertUnorderedList', 'justifyFull'], 'h3'),
  );

  it('lights the matching block, marks, list and alignment', () => {
    expect(isRichTextCommandActive('heading3', state)).toBe(true);
    expect(isRichTextCommandActive('paragraph', state)).toBe(false);
    expect(isRichTextCommandActive('italic', state)).toBe(true);
    expect(isRichTextCommandActive('bold', state)).toBe(false);
    expect(isRichTextCommandActive('bulletList', state)).toBe(true);
    expect(isRichTextCommandActive('justify', state)).toBe(true);
    expect(isRichTextCommandActive('alignRight', state)).toBe(false);
  });

  it('never lights one-shot actions', () => {
    expect(isRichTextCommandActive('undo', state)).toBe(false);
    expect(isRichTextCommandActive('link', state)).toBe(false);
    expect(isRichTextCommandActive('clearFormat', state)).toBe(false);
  });
});
