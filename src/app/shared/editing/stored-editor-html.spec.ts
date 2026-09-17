import { toStoredEditorHtml } from './stored-editor-html';

describe('toStoredEditorHtml', () => {
  it('stores nothing when the editor only holds empty markup', () => {
    expect(toStoredEditorHtml('')).toBe('');
    expect(toStoredEditorHtml('<br>')).toBe('');
    expect(toStoredEditorHtml('<p><br></p>')).toBe('');
    expect(toStoredEditorHtml('<div>&nbsp; </div>')).toBe('');
  });

  it('keeps markup that holds text', () => {
    expect(toStoredEditorHtml('<p>نص <b>عريض</b></p>')).toBe('<p>نص <b>عريض</b></p>');
  });
});
