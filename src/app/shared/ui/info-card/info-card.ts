import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

export type CardPadding = 'compact' | 'roomy';
export type CardCorner = 'small' | 'regular' | 'large';
export type CardHeadingSize = 'regular' | 'large';
export type CardHeadingFont = 'tajawal' | 'cairo';

/**
 * 16px or 24px of padding. Figma draws the 1px stroke inside that padding while CSS adds
 * the border outside it, so each side is 1px less to land the content where the frame does.
 */
const PADDING_CLASSES: Record<CardPadding, string> = {
  compact: 'p-[15px]',
  roomy: 'p-[23px]',
};

/** Most cards round 16px; the info and hours cards 12px; the map card 32px. */
const CORNER_CLASSES: Record<CardCorner, string> = {
  small: 'rounded-xl',
  regular: 'rounded-2xl',
  large: 'rounded-[32px]',
};

const HEADING_SIZE_CLASSES: Record<CardHeadingSize, string> = {
  regular: 'text-[14px]/[20px]',
  large: 'text-[16px]/[24px]',
};

const HEADING_FONT_CLASSES: Record<CardHeadingFont, string> = {
  tajawal: '',
  cairo: 'font-cairo',
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
  readonly corner = input<CardCorner>('regular');
  readonly headingSize = input<CardHeadingSize>('regular');
  readonly headingFont = input<CardHeadingFont>('tajawal');
  readonly edit = output<void>();

  protected readonly sectionClasses = computed(
    () => `${PADDING_CLASSES[this.padding()]} ${CORNER_CLASSES[this.corner()]}`,
  );
  protected readonly headingClasses = computed(
    () => `${HEADING_SIZE_CLASSES[this.headingSize()]} ${HEADING_FONT_CLASSES[this.headingFont()]}`,
  );
}
