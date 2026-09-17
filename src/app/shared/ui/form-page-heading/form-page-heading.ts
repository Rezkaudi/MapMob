import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../app-icon/app-icon';

/** The breadcrumb, title and description on top of the offer and ad forms. */
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
  /** The complaint detail page shows the title on its own. */
  readonly description = input<string>('');
}
