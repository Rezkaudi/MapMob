import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AddButton } from '../add-button/add-button';
import { ExportButton } from '../export-button/export-button';
import { DESCRIPTION_SIZE_CLASSES, DescriptionSize } from './description-size';

@Component({
  selector: 'app-page-header',
  imports: [AddButton, ExportButton],
  templateUrl: './page-header.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly descriptionSize = input<DescriptionSize>('regular');
  readonly addLabel = input<string>('');
  /** Hide it when the page shows its own add button, or a `pageHeaderAction` instead. */
  readonly isAddVisible = input<boolean>(true);
  /** The offers and ads headers put "تصدير" 8px to the left of the add button. */
  readonly isExportVisible = input<boolean>(false);
  readonly isExporting = input<boolean>(false);
  readonly add = output<void>();
  readonly exportRequested = output<void>();

  protected readonly descriptionClasses = computed(
    () => DESCRIPTION_SIZE_CLASSES[this.descriptionSize()],
  );
}
