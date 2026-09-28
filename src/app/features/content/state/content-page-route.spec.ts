import { CONTENT_URL, contentPageEditUrl } from './content-page-route';

describe('contentPageEditUrl', () => {
  it('opens each page at its own address under the content section', () => {
    expect(CONTENT_URL).toBe('/admin/content');
    expect(contentPageEditUrl('about')).toBe('/admin/content/about');
    expect(contentPageEditUrl('terms')).toBe('/admin/content/terms');
    expect(contentPageEditUrl('privacy')).toBe('/admin/content/privacy');
    expect(contentPageEditUrl('contact')).toBe('/admin/content/contact');
    expect(contentPageEditUrl('faq')).toBe('/admin/content/faq');
  });
});
