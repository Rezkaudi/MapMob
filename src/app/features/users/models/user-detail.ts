import { FavoritePlace } from './favorite-place';
import { AppUser } from './user';
import { UserActivity } from './user-activity';
import { UserActivityStats } from './user-activity-stats';
import { UserReview } from './user-review';

export interface UserDetail {
  readonly user: AppUser;
  readonly stats: UserActivityStats;
  readonly activities: readonly UserActivity[];
  readonly favoritePlaces: readonly FavoritePlace[];
  readonly reviews: readonly UserReview[];
}
