import { CONTENT_URL, contentPageEditUrl } from './content-page-route';

describe('contentPageEditUrl', () => {
  it('opens each page at its own address under the content section', () => {
    expect(CONTENT_URL).toBe('/content');
    expect(contentPageEditUrl('about')).toBe('/content/about');
    expect(contentPageEditUrl('terms')).toBe('/content/terms');
    expect(contentPageEditUrl('privacy')).toBe('/content/privacy');
    expect(contentPageEditUrl('contact')).toBe('/content/contact');
    expect(contentPageEditUrl('faq')).toBe('/content/faq');
  });
});
