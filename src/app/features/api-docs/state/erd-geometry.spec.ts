import { DbDomain } from '../models/db-domain';
import { DbTable } from '../models/db-table';
import {
  ERD_CARD_GAP,
  ERD_CARD_WIDTH,
  ERD_COLUMN_GAP,
  ERD_HEADER_HEIGHT,
  ERD_PADDING,
  ERD_ROW_HEIGHT,
  erdCanvasSize,
  layoutErdCards,
  linkErdCards,
} from './erd-geometry';

function table(name: string, columns: DbTable['columns']): DbTable {
  return { name, description: '', servedAs: '', columns };
}

const governorates = table('governorates', [
  { name: 'id', type: 'bigint', key: 'pk' },
  { name: 'name', type: 'varchar(120)' },
]);
const areas = table('areas', [
  { name: 'id', type: 'bigint', key: 'pk' },
  { name: 'governorate_id', type: 'bigint', key: 'fk', references: 'governorates.id' },
  { name: 'place_id', type: 'bigint', key: 'fk', references: 'places.id' },
]);
const categories = table('categories', [
  { name: 'id', type: 'bigint', key: 'pk' },
  { name: 'parent_id', type: 'bigint', key: 'fk', references: 'categories.id' },
]);

function domain(layout: string[][], tables: DbTable[]): DbDomain {
  return { id: 'd', name: 'D', description: '', tables, layout };
}

describe('layoutErdCards', () => {
  it('places columns side by side and stacks cards inside a column', () => {
    const cards = layoutErdCards(
      domain([['governorates', 'categories'], ['areas']], [governorates, areas, categories]),
    );
    const byName = Object.fromEntries(cards.map((card) => [card.table.name, card]));
    const governorateHeight = ERD_HEADER_HEIGHT + 2 * ERD_ROW_HEIGHT;

    expect(byName['governorates']).toMatchObject({
      x: ERD_PADDING,
      y: ERD_PADDING,
      height: governorateHeight,
    });
    expect(byName['categories']).toMatchObject({
      x: ERD_PADDING,
      y: ERD_PADDING + governorateHeight + ERD_CARD_GAP,
    });
    expect(byName['areas']).toMatchObject({
      x: ERD_PADDING + ERD_CARD_WIDTH + ERD_COLUMN_GAP,
      y: ERD_PADDING,
      width: ERD_CARD_WIDTH,
    });
  });
});

describe('erdCanvasSize', () => {
  it('reaches the far edge of the widest and tallest card', () => {
    const cards = layoutErdCards(domain([['governorates'], ['areas']], [governorates, areas]));

    expect(erdCanvasSize(cards)).toEqual({
      width: 2 * ERD_PADDING + 2 * ERD_CARD_WIDTH + ERD_COLUMN_GAP,
      height: 2 * ERD_PADDING + ERD_HEADER_HEIGHT + 3 * ERD_ROW_HEIGHT,
    });
  });
});

describe('linkErdCards', () => {
  const rowCenter = (row: number) =>
    ERD_PADDING + ERD_HEADER_HEIGHT + row * ERD_ROW_HEIGHT + ERD_ROW_HEIGHT / 2;

  it('draws a link from the key column to the row it points at', () => {
    const cards = layoutErdCards(domain([['governorates'], ['areas']], [governorates, areas]));
    const [link] = linkErdCards(cards);
    const areasLeft = ERD_PADDING + ERD_CARD_WIDTH + ERD_COLUMN_GAP;
    const governoratesRight = ERD_PADDING + ERD_CARD_WIDTH;

    expect(link.from).toEqual({ x: areasLeft, y: rowCenter(1) });
    expect(link.to).toEqual({ x: governoratesRight, y: rowCenter(0) });
    expect(link.path.startsWith(`M ${areasLeft} ${rowCenter(1)} C`)).toBe(true);
  });

  it('leaves out keys that point outside the diagram', () => {
    const cards = layoutErdCards(domain([['areas']], [areas]));

    expect(linkErdCards(cards)).toEqual([]);
  });

  it('loops a self reference out of the right edge', () => {
    const cards = layoutErdCards(domain([['categories']], [categories]));
    const [link] = linkErdCards(cards);
    const right = ERD_PADDING + ERD_CARD_WIDTH;

    expect(link.from).toEqual({ x: right, y: rowCenter(1) });
    expect(link.to).toEqual({ x: right, y: rowCenter(0) });
  });
});
