import { DbColumn } from '../models/db-column';
import { DbDomain } from '../models/db-domain';
import { ErdCard, ErdLink, ErdPoint, ErdSize } from '../models/erd-shapes';

export const ERD_CARD_WIDTH = 272;
export const ERD_HEADER_HEIGHT = 40;
export const ERD_ROW_HEIGHT = 26;
export const ERD_COLUMN_GAP = 100;
export const ERD_CARD_GAP = 40;
export const ERD_PADDING = 24;
/** How far a link between cards of one column swings out before it turns back. */
const LOOP_REACH = 56;

export function layoutErdCards(domain: DbDomain): ErdCard[] {
  const tablesByName = new Map(domain.tables.map((table) => [table.name, table]));
  return domain.layout.flatMap((names, columnIndex) => {
    let y = ERD_PADDING;
    return names.map((name) => {
      const table = tablesByName.get(name);
      if (!table) {
        throw new Error(`The ${domain.id} diagram names a missing table: ${name}`);
      }
      const height = ERD_HEADER_HEIGHT + table.columns.length * ERD_ROW_HEIGHT;
      const card = {
        table,
        x: ERD_PADDING + columnIndex * (ERD_CARD_WIDTH + ERD_COLUMN_GAP),
        y,
        width: ERD_CARD_WIDTH,
        height,
      };
      y += height + ERD_CARD_GAP;
      return card;
    });
  });
}

export function erdCanvasSize(cards: readonly ErdCard[]): ErdSize {
  return {
    width: Math.max(0, ...cards.map((card) => card.x + card.width)) + ERD_PADDING,
    height: Math.max(0, ...cards.map((card) => card.y + card.height)) + ERD_PADDING,
  };
}

export function erdRowCenter(card: ErdCard, rowIndex: number): number {
  return card.y + ERD_HEADER_HEIGHT + rowIndex * ERD_ROW_HEIGHT + ERD_ROW_HEIGHT / 2;
}

function curveBetween(from: ErdPoint, to: ErdPoint, reach: number, toReach: number): string {
  return `M ${from.x} ${from.y} C ${from.x + reach} ${from.y}, ${to.x + toReach} ${to.y}, ${to.x} ${to.y}`;
}

function linkBetween(
  source: ErdCard,
  rowIndex: number,
  target: ErdCard,
  targetRow: number,
): Omit<ErdLink, 'id'> {
  const sourceY = erdRowCenter(source, rowIndex);
  const targetY = erdRowCenter(target, targetRow);
  if (target.x === source.x) {
    const from = { x: source.x + source.width, y: sourceY };
    const to = { x: target.x + target.width, y: targetY };
    return { from, to, path: curveBetween(from, to, LOOP_REACH, LOOP_REACH) };
  }
  const isTargetRight = target.x > source.x;
  const from = { x: isTargetRight ? source.x + source.width : source.x, y: sourceY };
  const to = { x: isTargetRight ? target.x : target.x + target.width, y: targetY };
  const reach = (to.x - from.x) / 2;
  return { from, to, path: curveBetween(from, to, reach, -reach) };
}

function splitReference(column: DbColumn): [string, string] {
  const [tableName, columnName] = (column.references ?? '').split('.');
  return [tableName, columnName];
}

/** One link per key column whose table is drawn in the same diagram. */
export function linkErdCards(cards: readonly ErdCard[]): ErdLink[] {
  const cardsByName = new Map(cards.map((card) => [card.table.name, card]));
  return cards.flatMap((source) =>
    source.table.columns.flatMap((column, rowIndex) => {
      const [tableName, columnName] = splitReference(column);
      const target = cardsByName.get(tableName);
      if (!column.references || !target) {
        return [];
      }
      const targetRow = Math.max(
        0,
        target.table.columns.findIndex((one) => one.name === columnName),
      );
      const id = `${source.table.name}.${column.name}`;
      return [{ id, ...linkBetween(source, rowIndex, target, targetRow) }];
    }),
  );
}
