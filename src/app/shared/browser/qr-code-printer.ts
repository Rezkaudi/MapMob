import { DOCUMENT, Injectable, inject } from '@angular/core';
import { QUIET_ZONE_MODULES } from '../qr-code/draw-qr-code';
import { QrCodeMatrix } from '../qr-code/qr-code-matrix';
import { toQrCodePath } from '../qr-code/qr-code-path';
import { QrCodePrintPage } from '../qr-code/qr-code-print-page';
import { QR_CODE_PRINT_STYLES } from '../qr-code/qr-code-print-styles';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const APP_FONTS_LINK = 'link[href*="fonts.googleapis.com/css"]';
/** Print anyway if the web fonts are slow, rather than leave the click hanging. */
const FONT_WAIT_LIMIT_MS = 1500;
const PRINTED_FONTS = ['700 28pt Tajawal', '400 13pt Cairo'];

/** Prints only the QR sheet, from a hidden frame, so the dashboard around it stays off paper. */
@Injectable({ providedIn: 'root' })
export class QrCodePrinter {
  private readonly document = inject(DOCUMENT);

  async print(page: QrCodePrintPage): Promise<void> {
    const frame = this.document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0';
    this.document.body.appendChild(frame);
    const frameWindow = frame.contentWindow;
    const frameDocument = frame.contentDocument;
    if (!frameWindow || !frameDocument) {
      frame.remove();
      return;
    }
    const fontsLink = this.fillSheet(frameDocument, page);
    await waitForFonts(frameDocument, fontsLink);
    frameWindow.addEventListener('afterprint', () => frame.remove(), { once: true });
    frameWindow.focus();
    frameWindow.print();
  }

  private fillSheet(sheet: Document, page: QrCodePrintPage): HTMLLinkElement | null {
    sheet.documentElement.lang = 'ar';
    sheet.documentElement.dir = 'rtl';
    sheet.title = page.storeName;
    const style = sheet.createElement('style');
    style.textContent = QR_CODE_PRINT_STYLES;
    const fontsLink = this.copyFontsLink(sheet);
    sheet.head.append(...[style, fontsLink].filter((node) => node !== null));
    sheet.body.append(
      createText(sheet, 'h1', page.storeName),
      createText(sheet, 'p', page.caption, 'caption'),
      createQrCodeSvg(sheet, page.matrix),
      createText(sheet, 'p', page.displayUrl, 'link'),
    );
    return fontsLink;
  }

  private copyFontsLink(sheet: Document): HTMLLinkElement | null {
    const appLink = this.document.querySelector<HTMLLinkElement>(APP_FONTS_LINK);
    if (!appLink) {
      return null;
    }
    const link = sheet.createElement('link');
    link.rel = 'stylesheet';
    link.href = appLink.href;
    return link;
  }
}

function createText(sheet: Document, tag: 'h1' | 'p', text: string, role?: string): HTMLElement {
  const element = sheet.createElement(tag);
  element.textContent = text;
  if (role) {
    element.dataset['role'] = role;
  }
  return element;
}

function createQrCodeSvg(sheet: Document, matrix: QrCodeMatrix): SVGSVGElement {
  const side = matrix.length + QUIET_ZONE_MODULES * 2;
  const svg = sheet.createElementNS(SVG_NAMESPACE, 'svg');
  svg.setAttribute('viewBox', `${-QUIET_ZONE_MODULES} ${-QUIET_ZONE_MODULES} ${side} ${side}`);
  svg.setAttribute('shape-rendering', 'crispEdges');
  const path = sheet.createElementNS(SVG_NAMESPACE, 'path');
  path.setAttribute('d', toQrCodePath(matrix));
  svg.append(path);
  return svg;
}

function waitForFonts(sheet: Document, fontsLink: HTMLLinkElement | null): Promise<unknown> {
  if (!fontsLink || !sheet.fonts) {
    return Promise.resolve();
  }
  const fontsLoaded = new Promise((done) => {
    fontsLink.onload = fontsLink.onerror = done;
  }).then(() => Promise.all(PRINTED_FONTS.map((font) => sheet.fonts.load(font))));
  const timeLimit = new Promise((done) => setTimeout(done, FONT_WAIT_LIMIT_MS));
  return Promise.race([fontsLoaded, timeLimit]);
}
