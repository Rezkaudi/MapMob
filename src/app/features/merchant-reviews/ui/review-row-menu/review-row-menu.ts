import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The row's kebab: "عرض التفاصيل", then "الإبلاغ عن مراجعة" while the review is unreported. */
@Component({
  selector: 'app-review-row-menu',
  imports: [ActionMenu, AppIcon],
  templateUrl: './review-row-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewRowMenu {
  readonly canReport = input<boolean>(true);
  readonly view = output<void>();
  readonly report = output<void>();
}
