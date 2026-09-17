import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RadioDot } from '../radio-dot/radio-dot';

const PICKED_CARD = 'border-2 border-primary bg-[rgba(239,246,255,0.4)]';
const IDLE_CARD = 'border border-text-secondary bg-white hover:border-primary';
/**
 * `regular` is the ad form's 68px card; `roomy` is the offer form's 70px card; `tall` is the resend
 * frame's card, whose dot stays at the top above a two-line description; `bar` is the notification
 * form's 48px title-only card; `featured` is its 71px send-now card, a regular card with 11px text.
 */
export type OptionCardSize = 'regular' | 'roomy' | 'tall' | 'bar' | 'featured';

/** The 1px idle border gets 1px more padding, so both states keep the same size. */
const DESCRIBED_PADDING: Record<OptionCardSize, { picked: string; idle: string }> = {
  regular: { picked: 'items-center px-[11px] py-3', idle: 'items-center px-3 py-[13px]' },
  roomy: { picked: 'items-center px-3 py-[13px]', idle: 'items-center px-[13px] py-[14px]' },
  tall: { picked: 'items-start px-[11px] py-3', idle: 'items-start px-[11px] py-3' },
  bar: { picked: 'items-center px-[11px] py-[13px]', idle: 'items-center px-3 py-[14px]' },
  featured: { picked: 'items-center px-[11px] py-3', idle: 'items-center px-3 py-[13px]' },
};
/** The tall card keeps its 2px border when idle too, only greyed. */
const TALL_IDLE_CARD =
  'border-2 border-text-secondary bg-[rgba(239,246,255,0.4)] hover:border-primary';
const DESCRIPTION_CLASSES: Record<OptionCardSize, string> = {
  regular: 'text-[10px]/[15px]',
  roomy: 'text-[10px]/[15px]',
  tall: 'text-[11px]/[18px]',
  bar: 'text-[10px]/[15px]',
  featured: 'text-[11px]/[18px]',
};
const PICKED_TITLE = 'font-bold text-primary';
const IDLE_TITLE = 'font-semibold text-text-primary';
const BAR_TITLE = 'font-bold text-text-primary';
const TITLE_ONLY_PADDING = {
  picked: 'items-center px-[15px] py-[9px]',
  idle: 'items-center min-h-10 px-4 py-2.5',
};

/** A radio drawn as a card: the offer scope, the advertiser type and the ad content type. */
@Component({
  selector: 'app-option-card',
  imports: [RadioDot],
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
    const hasOwnPadding = this.description() || this.size() === 'bar';
    const padding = hasOwnPadding ? DESCRIBED_PADDING[this.size()] : TITLE_ONLY_PADDING;
    if (this.isSelected()) {
      return `${PICKED_CARD} ${padding.picked}`;
    }
    return `${this.size() === 'tall' ? TALL_IDLE_CARD : IDLE_CARD} ${padding.idle}`;
  });
  protected readonly titleClasses = computed(() => {
    if (this.size() === 'bar') {
      return BAR_TITLE;
    }
    return this.isSelected() ? PICKED_TITLE : IDLE_TITLE;
  });
  protected readonly descriptionClasses = computed(() => DESCRIPTION_CLASSES[this.size()]);
}
