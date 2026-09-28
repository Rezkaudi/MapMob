import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-docs-section-heading',
  templateUrl: './docs-section-heading.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsSectionHeading {
  readonly number = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input('');
}
