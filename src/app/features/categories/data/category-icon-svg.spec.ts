import { buildCategoryIconSvg } from './category-icon-svg';

describe('buildCategoryIconSvg', () => {
  it('writes the Lucide drawing as a stroked SVG in the category colour', () => {
    const svg = buildCategoryIconSvg('coffee', '#FF8104');

    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('stroke="#FF8104"');
    expect(svg).toContain('<path d="M10 2v2"');
    expect(svg).toContain('width="96"');
  });

  it('gives nothing for a name the picker does not know', () => {
    expect(buildCategoryIconSvg('no-such-icon', '#FF8104')).toBeNull();
  });
});
