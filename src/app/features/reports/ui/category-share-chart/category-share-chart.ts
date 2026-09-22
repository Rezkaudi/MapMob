import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { CategoryShare } from '../../models/category-share';
import { PieCircle } from './pie-circle';
import { buildPieSlices } from './pie-slice-geometry';

const PIE_SIZE = 224;
const PIE_CIRCLE: PieCircle = {
  centerX: PIE_SIZE / 2,
  centerY: PIE_SIZE / 2,
  radius: PIE_SIZE / 2,
  labelRadiusRatio: 0.54,
};
const FULL_OPACITY = 1;
const DIMMED_OPACITY = 0.45;
const SLICE_COLORS: readonly string[] = [
  '#8979ff',
  '#ff928a',
  '#3cc3df',
  '#ffae4c',
  '#537ff1',
  '#6fd195',
];

/** The pie of companies and shops per category. Slices start at three o'clock. */
@Component({
  selector: 'app-category-share-chart',
  imports: [Skeleton],
  templateUrl: './category-share-chart.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryShareChart {
  readonly title = input.required<string>();
  readonly shares = input.required<readonly CategoryShare[]>();
  readonly isLoading = input<boolean>(false);

  protected readonly pieSize = PIE_SIZE;
  protected readonly pieSizeInPixels = `${PIE_SIZE}px`;

  protected readonly hoveredIndex = signal<number | null>(null);

  protected readonly hoveredSlice = computed(() => {
    const index = this.hoveredIndex();
    return index === null ? null : (this.slices()[index] ?? null);
  });

  protected readonly slices = computed(() => {
    const shares = this.shares();
    const geometry = buildPieSlices(
      shares.map((category) => category.share),
      PIE_CIRCLE,
    );
    return geometry.map((slice, index) => ({
      ...slice,
      name: shares[index].categoryName,
      spokenName: `${shares[index].categoryName} ${shares[index].share}%`,
      color: SLICE_COLORS[index % SLICE_COLORS.length],
      tooltipText: `${shares[index].categoryName} · ${shares[index].share}%`,
      index,
    }));
  });

  protected opacityOf(index: number): number {
    const hovered = this.hoveredIndex();
    return hovered === null || hovered === index ? FULL_OPACITY : DIMMED_OPACITY;
  }

  protected showTooltipFor(index: number): void {
    this.hoveredIndex.set(index);
  }

  protected hideTooltip(): void {
    this.hoveredIndex.set(null);
  }
}
