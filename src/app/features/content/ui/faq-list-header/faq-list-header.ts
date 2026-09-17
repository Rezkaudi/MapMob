import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The grey bar on top of the questions: the list name and count, then expand and collapse all. */
@Component({
  selector: 'app-faq-list-header',
  imports: [AppIcon],
  templateUrl: './faq-list-header.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqListHeader {
  readonly questionCount = input.required<number>();
  readonly expandAll = output<void>();
  readonly collapseAll = output<void>();
}
