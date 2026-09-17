import { escapeHtml } from './escaped-html';

describe('escapeHtml', () => {
  it('turns the characters HTML reads as markup into entities', () => {
    expect(escapeHtml(`<b class="x">'Tom' & Jerry</b>`)).toBe(
      '&lt;b class=&quot;x&quot;&gt;&#39;Tom&#39; &amp; Jerry&lt;/b&gt;',
    );
  });

  it('leaves plain text alone', () => {
    expect(escapeHtml('June 16')).toBe('June 16');
  });
});
