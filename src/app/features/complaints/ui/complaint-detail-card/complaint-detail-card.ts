import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** The reported-place card writes its heading in regular weight; the other three use medium. */
export type DetailCardHeadingWeight = 'medium' | 'regular';

/** The content card sits 20px in from its top and bottom; the others 24px. */
export type DetailCardSpacing = 'regular' | 'tight';

const HEADING_CLASSES: Record<DetailCardHeadingWeight, string> = {
  medium: 'font-medium text-text-primary',
  regular: 'font-normal text-[#191c1e]',
};

const SPACING_CLASSES: Record<DetailCardSpacing, string> = {
  regular: 'py-6',
  tight: 'py-5',
};

let nextHeadingNumber = 0;

/** The white card each block of the complaint detail page sits in. */
@Component({
  selector: 'app-complaint-detail-card',
  templateUrl: './complaint-detail-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintDetailCard {
  readonly heading = input.required<string>();
  readonly headingWeight = input<DetailCardHeadingWeight>('medium');
  readonly spacing = input<DetailCardSpacing>('regular');

  protected readonly headingId = `complaint-detail-card-${nextHeadingNumber++}`;
  protected readonly headingClasses = computed(() => HEADING_CLASSES[this.headingWeight()]);
  protected readonly spacingClasses = computed(() => SPACING_CLASSES[this.spacing()]);
}
