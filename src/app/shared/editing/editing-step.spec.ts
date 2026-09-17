import { editingStepFor } from './editing-step';

describe('editingStepFor', () => {
  it('turns block commands into formatBlock steps', () => {
    expect(editingStepFor('heading1')).toEqual({ name: 'formatBlock', value: '<h1>' });
    expect(editingStepFor('heading2')).toEqual({ name: 'formatBlock', value: '<h2>' });
    expect(editingStepFor('heading3')).toEqual({ name: 'formatBlock', value: '<h3>' });
    expect(editingStepFor('paragraph')).toEqual({ name: 'formatBlock', value: '<p>' });
  });

  it('maps inline, list, alignment and history commands to their browser names', () => {
    expect(editingStepFor('bold')).toEqual({ name: 'bold' });
    expect(editingStepFor('italic')).toEqual({ name: 'italic' });
    expect(editingStepFor('underline')).toEqual({ name: 'underline' });
    expect(editingStepFor('bulletList')).toEqual({ name: 'insertUnorderedList' });
    expect(editingStepFor('numberedList')).toEqual({ name: 'insertOrderedList' });
    expect(editingStepFor('alignRight')).toEqual({ name: 'justifyRight' });
    expect(editingStepFor('alignCenter')).toEqual({ name: 'justifyCenter' });
    expect(editingStepFor('alignLeft')).toEqual({ name: 'justifyLeft' });
    expect(editingStepFor('justify')).toEqual({ name: 'justifyFull' });
    expect(editingStepFor('clearFormat')).toEqual({ name: 'removeFormat' });
    expect(editingStepFor('undo')).toEqual({ name: 'undo' });
    expect(editingStepFor('redo')).toEqual({ name: 'redo' });
  });
});
