import { DOCUMENT, Injectable, inject } from '@angular/core';

const PNG_TYPE = 'image/png';
const SVG_TYPE = 'image/svg+xml';

/** The live server keeps category icons as uploaded pictures, so the picked icon becomes one. */
@Injectable({ providedIn: 'root' })
export class CategoryIconFileMaker {
  private readonly document = inject(DOCUMENT);

  async makeFile(iconName: string, color: string): Promise<File | null> {
    // The icon set is large, so it loads only when an icon is saved.
    const { buildCategoryIconSvg } = await import('./category-icon-svg');
    const svg = buildCategoryIconSvg(iconName, color);
    if (!svg) {
      return null;
    }
    const png = await this.drawPng(svg);
    return png
      ? new File([png], `${iconName}.png`, { type: PNG_TYPE })
      : new File([svg], `${iconName}.svg`, { type: SVG_TYPE });
  }

  // The phone app shows plain pictures, so a PNG is sent whenever the browser can draw one.
  private async drawPng(svg: string): Promise<Blob | null> {
    const canvas = this.document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }
    const picture = new Image();
    picture.src = `data:${SVG_TYPE};charset=utf-8,${encodeURIComponent(svg)}`;
    await picture.decode();
    canvas.width = picture.naturalWidth;
    canvas.height = picture.naturalHeight;
    context.drawImage(picture, 0, 0);
    return new Promise((resolve) => canvas.toBlob(resolve, PNG_TYPE));
  }
}
