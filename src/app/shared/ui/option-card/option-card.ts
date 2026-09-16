import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

const PICKED_CARD = 'border-2 border-primary bg-[rgba(239,246,255,0.4)]';
const IDLE_CARD = 'border border-text-secondary bg-white hover:border-primary';
/** `regular` is the ad form's 68px card; `roomy` is the offer form's 70px card. */
export type OptionCardSize = 'regular' | 'roomy';

/** The 1px idle border gets 1px more padding, so both states keep the same size. */
const DESCRIBED_PADDING: Record<OptionCardSize, { picked: string; idle: string }> = {
  regular: { picked: 'px-[11px] py-3', idle: 'px-3 py-[13px]' },
  roomy: { picked: 'px-3 py-[13px]', idle: 'px-[13px] py-[14px]' },
};
const TITLE_ONLY_PADDING = { picked: 'px-[15px] py-[9px]', idle: 'min-h-10 px-4 py-2.5' };

/** A radio drawn as a card: the offer scope, the advertiser type and the ad content type. */
@Component({
  selector: 'app-option-card',
  templateUrl: './option-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionCard {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly isSelected = input<boolean>(false);
  readonly size = input<OptionCardSize>('regular');
  readonly picked = output<void>();

  protected readonly classes = computed(() => {
    const padding = this.description() ? DESCRIBED_PADDING[this.size()] : TITLE_ONLY_PADDING;
    return this.isSelected() ? `${PICKED_CARD} ${padding.picked}` : `${IDLE_CARD} ${padding.idle}`;
  });
}
