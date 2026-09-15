import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LatinDigitDatePipe } from '../../../../shared/pipes/latin-digit-date.pipe';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { AppUser } from '../../models/user';
import { UserProfileView } from '../../state/user-profile-view';

@Component({
  selector: 'app-user-profile-card',
  imports: [AppIcon, LatinDigitDatePipe],
  templateUrl: './user-profile-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileCard {
  readonly user = input.required<AppUser>();
  readonly profile = input.required<UserProfileView>();
}
