import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../app-icon/app-icon';
import { DESCRIPTION_SIZE_CLASSES, DescriptionSize } from '../page-header/description-size';

/** `form` is the add/edit pages' 28px title; `detail` the place page's 24px one with its meta line. */
export type PageHeadingAppearance = 'form' | 'detail';

const APPEARANCE_CLASSES: Record<PageHeadingAppearance, { title: string; row: string }> = {
  form: { title: 'text-[28px]/[34px] text-black', row: 'items-center' },
  detail: { title: 'text-[24px]/[29px] text-text-primary', row: 'items-start' },
};

/** The breadcrumb, title and description on top of the form and detail pages. */
@Component({
  selector: 'app-form-page-heading',
  imports: [AppIcon, RouterLink],
  templateUrl: './form-page-heading.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPageHeading {
  readonly parentLabel = input.required<string>();
  readonly parentLink = input.required<string>();
  readonly title = input.required<string>();
  /** The content pages call every step "تعديل صفحة"; other pages repeat the title. */
  readonly currentLabel = input<string>('');
  /** The complaint detail page shows the title on its own. */
  readonly description = input<string>('');
  readonly descriptionSize = input<DescriptionSize>('regular');
  readonly appearance = input<PageHeadingAppearance>('form');

  protected readonly crumbLabel = computed(() => this.currentLabel() || this.title());
  protected readonly appearanceClasses = computed(() => APPEARANCE_CLASSES[this.appearance()]);
  protected readonly descriptionClasses = computed(
    () => DESCRIPTION_SIZE_CLASSES[this.descriptionSize()],
  );
}
