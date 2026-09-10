import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

export type CardPadding = 'compact' | 'roomy';

/** The sidebar cards are padded 16px, the wide cards in the main column 24px. */
const PADDING_CLASSES: Record<CardPadding, string> = {
  compact: 'p-4',
  roomy: 'p-6',
};

/** A white panel with a heading and an optional "تعديل" link, as the detail page uses. */
@Component({
  selector: 'app-info-card',
  imports: [AppIcon],
  templateUrl: './info-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCard {
  readonly heading = input.required<string>();
  readonly canEdit = input<boolean>(false);
  readonly padding = input<CardPadding>('roomy');
  readonly edit = output<void>();

  protected readonly paddingClasses = computed(() => PADDING_CLASSES[this.padding()]);
}
