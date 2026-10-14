import { formatPlatformName, hasSeparateLatinName } from './platform-name';

const TALABAT = { id: '3', name: 'طلبات', latinName: 'Talabat', logoUrl: null };
const TAWSEEL = { id: '1', name: 'tawseel', latinName: 'tawseel', logoUrl: null };

describe('platform name', () => {
  it('adds the Latin name in brackets when it differs', () => {
    expect(formatPlatformName(TALABAT)).toBe('طلبات (Talabat)');
    expect(hasSeparateLatinName(TALABAT)).toBe(true);
  });

  it('says a name once when both are the same', () => {
    expect(formatPlatformName(TAWSEEL)).toBe('tawseel');
    expect(hasSeparateLatinName(TAWSEEL)).toBe(false);
  });
});
