import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';
import { Skeleton } from '../skeleton/skeleton';
import { ChartPanelAppearance } from './chart-panel-appearance';
import { ChartPeriodOption } from './chart-period-option';

const DEFAULT_CHART_HEIGHT = '280px';

// Figma strokes sit inside the box, so each padding is 1px less than the frame's inset.
const RAISED_CARD =
  'h-[320px] gap-[7px] overflow-hidden rounded-xl border border-border bg-surface px-[18.5px] pt-[15px]';

const SECTION_CLASSES: Record<ChartPanelAppearance, string> = {
  panel: 'gap-4 rounded-2xl border border-border bg-surface p-4 shadow-panel',
  raised: `${RAISED_CARD} shadow-[0_4px_30px_0_rgba(238,238,238,0.8)]`,
  'raised-short-shadow': `${RAISED_CARD} shadow-[0_4px_20px_0_rgba(238,238,238,0.8)]`,
  outlined:
    'gap-6 rounded-lg border border-border bg-surface p-[23px] shadow-[0_4px_30px_0_rgba(238,238,238,0.08)]',
};

const TITLE_CLASSES: Record<ChartPanelAppearance, string> = {
  panel: '',
  raised: '',
  'raised-short-shadow': '',
  outlined: 'max-w-[229px]',
};

/** A chart card: title on the start side, period tabs and a calendar button on the end side. */
@Component({
  selector: 'app-chart-panel',
  imports: [AppIcon, Skeleton],
  templateUrl: './chart-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPanel {
  readonly title = input.required<string>();
  readonly periods = input.required<readonly ChartPeriodOption[]>();
  readonly activePeriod = input.required<string>();
  readonly isLoading = input<boolean>(false);
  /** Height of the placeholder drawn while the chart loads. */
  readonly chartHeight = input<string>(DEFAULT_CHART_HEIGHT);
  readonly appearance = input<ChartPanelAppearance>('panel');
  readonly periodChange = output<string>();

  protected readonly sectionClasses = computed(() => SECTION_CLASSES[this.appearance()]);
  protected readonly titleClasses = computed(() => TITLE_CLASSES[this.appearance()]);
}
