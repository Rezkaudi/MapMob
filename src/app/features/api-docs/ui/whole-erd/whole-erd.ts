import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { DbDomain } from '../../models/db-domain';
import { keysOnly } from '../../state/keys-only';
import { ErdDiagram } from '../erd-diagram/erd-diagram';

const ZOOM_LEVELS = [50, 75, 100] as const;
const FULL_SIZE = 100;
/** Scales the drawing to the frame's width, so the whole database shows at once. */
const FIT = null;

@Component({
  selector: 'app-whole-erd',
  imports: [ErdDiagram],
  templateUrl: './whole-erd.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WholeErd {
  readonly domain = input.required<DbDomain>();

  protected readonly zoomLevels = ZOOM_LEVELS;
  protected readonly fit = FIT;
  protected readonly zoomPercent = signal<number | null>(FIT);
  protected readonly isKeysOnly = signal(false);
  protected readonly drawnDomain = computed(() =>
    this.isKeysOnly() ? keysOnly(this.domain()) : this.domain(),
  );
  protected readonly zoom = computed(() => {
    const percent = this.zoomPercent();
    return percent === FIT ? null : percent / FULL_SIZE;
  });
  protected readonly tableCount = computed(() => this.domain().tables.length);
}
