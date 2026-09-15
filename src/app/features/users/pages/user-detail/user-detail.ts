import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { UserDetailStore } from '../../state/user-detail.store';
import { DetailSectionCard } from '../../ui/detail-section-card/detail-section-card';
import { FavoritePlaceList } from '../../ui/favorite-place-list/favorite-place-list';
import { UserActivityTimeline } from '../../ui/user-activity-timeline/user-activity-timeline';
import { UserDetailSkeleton } from '../../ui/user-detail-skeleton/user-detail-skeleton';
import { UserProfileCard } from '../../ui/user-profile-card/user-profile-card';
import { UserReviewList } from '../../ui/user-review-list/user-review-list';

@Component({
  selector: 'app-user-detail',
  imports: [
    AppIcon,
    DetailSectionCard,
    ErrorState,
    FavoritePlaceList,
    PageHeader,
    RouterLink,
    StatCard,
    UserActivityTimeline,
    UserDetailSkeleton,
    UserProfileCard,
    UserReviewList,
  ],
  templateUrl: './user-detail.html',
  providers: [UserDetailStore],
  // The design paints this page white, unlike the grey list pages, so it covers the shell padding too.
  host: { class: 'block -m-8 min-h-[calc(100%+4rem)] bg-surface p-8' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailPage {
  /** Bound from the `:id` route parameter. */
  readonly id = input.required<string>();

  protected readonly store = inject(UserDetailStore);

  constructor() {
    this.store.loadUser(this.id);
  }

  protected reload(): void {
    this.store.loadUser(this.id());
  }
}
