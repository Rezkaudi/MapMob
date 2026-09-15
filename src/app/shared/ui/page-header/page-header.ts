import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AddButton } from '../add-button/add-button';

export type DescriptionSize = 'regular' | 'small';

const DESCRIPTION_CLASSES: Record<DescriptionSize, string> = {
  regular: 'text-[16px]/[19px]',
  small: 'text-[14px]/[20px]',
};

@Component({
  selector: 'app-page-header',
  imports: [AddButton],
  templateUrl: './page-header.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  /** The reviews design writes its description at 14px; the other pages use 16px. */
  readonly descriptionSize = input<DescriptionSize>('regular');
  readonly addLabel = input<string>('');
  /** Hide it when the page shows its own add button, or a `pageHeaderAction` instead. */
  readonly isAddVisible = input<boolean>(true);
  readonly add = output<void>();

  protected readonly descriptionClasses = computed(
    () => DESCRIPTION_CLASSES[this.descriptionSize()],
  );
}
