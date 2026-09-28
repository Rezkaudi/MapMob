import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DbColumn } from '../../models/db-column';
import { DbDomain } from '../../models/db-domain';
import { ErdCard } from '../../models/erd-shapes';
import {
  ERD_HEADER_HEIGHT,
  ERD_ROW_HEIGHT,
  erdCanvasSize,
  erdRowCenter,
  layoutErdCards,
  linkErdCards,
} from '../../state/erd-geometry';
import { shortColumnType } from '../../state/short-column-type';
import { ErdRow } from './erd-row';

const KEY_LABELS: Record<string, string> = { pk: 'PK', fk: 'FK', uq: 'UQ' };

@Component({
  selector: 'app-erd-diagram',
  templateUrl: './erd-diagram.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErdDiagram {
  readonly domain = input.required<DbDomain>();
  /** 1 draws at full size; `null` fits the frame's width. Only the scale changes, never the content. */
  readonly zoom = input<number | null>(1);

  protected readonly drawnWidth = computed(() => {
    const zoom = this.zoom();
    return zoom === null ? '100%' : String(this.size().width * zoom);
  });
  protected readonly drawnHeight = computed(() => {
    const zoom = this.zoom();
    return zoom === null ? null : String(this.size().height * zoom);
  });

  protected readonly headerHeight = ERD_HEADER_HEIGHT;
  protected readonly rowHeight = ERD_ROW_HEIGHT;
  protected readonly cards = computed(() => layoutErdCards(this.domain()));
  protected readonly links = computed(() => linkErdCards(this.cards()));
  protected readonly size = computed(() => erdCanvasSize(this.cards()));
  protected readonly markerId = computed(() => this.domain().id);

  protected rowsOf(card: ErdCard): ErdRow[] {
    const drawn = new Set(this.domain().layout.flat());
    return card.table.columns.map((column, index) => {
      const target = column.references?.split('.')[0] ?? '';
      const isExternalReference = !!column.references && !drawn.has(target);
      return {
        column,
        y: erdRowCenter(card, index),
        keyLabel: this.keyLabelOf(column),
        typeLabel: isExternalReference ? `→ ${target}` : shortColumnType(column.type),
        isExternalReference,
      };
    });
  }

  private keyLabelOf(column: DbColumn): string {
    if (column.references) {
      return 'FK';
    }
    return KEY_LABELS[column.key ?? ''] ?? '';
  }
}
