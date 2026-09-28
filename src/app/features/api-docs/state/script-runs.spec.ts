import { splitScriptRuns } from './script-runs';

describe('splitScriptRuns', () => {
  it('keeps Latin text as one run', () => {
    expect(splitScriptRuns('"PL-0012"')).toEqual([{ text: '"PL-0012"', isArabic: false }]);
  });

  it('keeps an Arabic phrase with its spaces as one run', () => {
    expect(splitScriptRuns('"متجر دمشق المركزي"')).toEqual([
      { text: '"', isArabic: false },
      { text: 'متجر دمشق المركزي', isArabic: true },
      { text: '"', isArabic: false },
    ]);
  });

  it('splits mixed text at each change of script', () => {
    expect(splitScriptRuns('-d \'{"name":"مطاعم"}\'').map((run) => run.isArabic)).toEqual([
      false,
      true,
      false,
    ]);
  });

  it('gives nothing for empty text', () => {
    expect(splitScriptRuns('')).toEqual([]);
  });
});
