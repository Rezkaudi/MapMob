import { withSavedOption } from './with-saved-option';

describe('withSavedOption', () => {
  const CITIES = ['الرياض', 'جدة'];

  it('keeps the list as it is when nothing is saved', () => {
    expect(withSavedOption(CITIES, undefined)).toEqual(CITIES);
    expect(withSavedOption(CITIES, '')).toEqual(CITIES);
  });

  it('keeps the list as it is when the saved value is already on it', () => {
    expect(withSavedOption(CITIES, 'جدة')).toEqual(CITIES);
  });

  it('adds a saved value the list does not offer, so the field can show it', () => {
    expect(withSavedOption(CITIES, 'طرطوس')).toEqual(['طرطوس', 'الرياض', 'جدة']);
  });
});
