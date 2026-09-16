import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/** `rounded` is the place form's card; `compact` is the offer form's, with 8px corners. */
export type FormSectionAppearance = 'rounded' | 'compact';

const SECTION_CLASSES: Record<FormSectionAppearance, string> = {
  rounded: 'rounded-xl border-border',
  compact: 'rounded-lg border-[#e0e3e5] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]',
};
const HEADER_CLASSES: Record<FormSectionAppearance, string> = {
  rounded: 'rounded-t-xl border-border bg-surface-muted',
  compact: 'rounded-t-lg border-[#e0e3e5] bg-[#f7f9fb]',
};
const HEADING_CLASSES: Record<FormSectionAppearance, string> = {
  rounded: 'gap-2',
  compact: 'gap-3',
};

/** One card of a form: an amber-headed panel with the fields inside. */
@Component({
  selector: 'app-form-section',
  imports: [AppIcon],
  templateUrl: './form-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSection {
  readonly heading = input.required<string>();
  readonly icon = input.required<string>();
  readonly appearance = input<FormSectionAppearance>('rounded');

  protected readonly sectionClasses = computed(() => SECTION_CLASSES[this.appearance()]);
  protected readonly headerClasses = computed(() => HEADER_CLASSES[this.appearance()]);
  protected readonly headingClasses = computed(() => HEADING_CLASSES[this.appearance()]);
}
