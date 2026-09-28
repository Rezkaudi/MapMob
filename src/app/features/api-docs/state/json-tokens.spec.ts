import { tokenizeJson } from './json-tokens';

describe('tokenizeJson', () => {
  const text = JSON.stringify(
    { name: 'مطاعم', count: -1.5, isActive: true, parentId: null },
    null,
    2,
  );

  it('gives back the exact text when the tokens are joined', () => {
    expect(
      tokenizeJson(text)
        .map((token) => token.text)
        .join(''),
    ).toBe(text);
  });

  it('marks keys apart from string values', () => {
    const tokens = tokenizeJson('{"name": "مطاعم"}');

    expect(tokens).toContainEqual({ kind: 'key', text: '"name"' });
    expect(tokens).toContainEqual({ kind: 'string', text: '"مطاعم"' });
  });

  it('marks numbers and literals', () => {
    const kinds = tokenizeJson(text).map((token) => token.kind);

    expect(kinds).toContain('number');
    expect(kinds.filter((kind) => kind === 'literal')).toHaveLength(2);
  });

  it('keeps an escaped quote inside one string', () => {
    expect(tokenizeJson('"say \\"hi\\""')).toEqual([{ kind: 'string', text: '"say \\"hi\\""' }]);
  });

  it('treats plain text as one plain token', () => {
    expect(tokenizeJson('(empty body)')).toEqual([{ kind: 'plain', text: '(empty body)' }]);
  });
});
