import { findCategoryIcon } from '../models/category-icon';

/** Big enough to stay sharp when the app scales the uploaded picture down. */
const ICON_SIZE = 96;
const LUCIDE_VIEW_BOX = '0 0 24 24';
const LUCIDE_STROKE_WIDTH = 2;

function toAttributes(attributes: Record<string, unknown>): string {
  return Object.entries(attributes)
    .map(([name, value]) => `${name}="${String(value)}"`)
    .join(' ');
}

/** The picked Lucide icon as an SVG file, drawn the way the picker shows it. */
export function buildCategoryIconSvg(iconName: string, color: string): string | null {
  const entry = findCategoryIcon(iconName);
  if (!entry) {
    return null;
  }
  const shapes = entry.data.node
    .map(([tag, attributes]) => `<${tag} ${toAttributes(attributes)}/>`)
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" ` +
    `viewBox="${LUCIDE_VIEW_BOX}" fill="none" stroke="${color}" ` +
    `stroke-width="${LUCIDE_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round">` +
    `${shapes}</svg>`
  );
}
