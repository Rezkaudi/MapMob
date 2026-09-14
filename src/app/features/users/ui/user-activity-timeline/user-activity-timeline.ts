import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ActivityRow } from '../../state/user-detail-view';

@Component({
  selector: 'app-user-activity-timeline',
  imports: [AppIcon],
  templateUrl: './user-activity-timeline.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityTimeline {
  readonly rows = input.required<readonly ActivityRow[]>();
}
