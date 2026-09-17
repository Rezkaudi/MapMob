import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../app-icon/app-icon';
import { DescriptionSize } from '../page-header/page-header';

const DESCRIPTION_CLASSES: Record<DescriptionSize, string> = {
  regular: 'text-[16px]/[19px]',
  small: 'text-[14px]/[20px]',
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

  protected readonly crumbLabel = computed(() => this.currentLabel() || this.title());
  protected readonly descriptionClasses = computed(
    () => DESCRIPTION_CLASSES[this.descriptionSize()],
  );
}
