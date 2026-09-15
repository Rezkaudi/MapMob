import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Reviewer } from '../../models/reviewer';

@Component({
  selector: 'app-reviewer-profile',
  templateUrl: './reviewer-profile.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewerProfile {
  readonly reviewer = input.required<Reviewer>();
  readonly initials = input.required<string>();
  readonly metaLabel = input.required<string>();
}
