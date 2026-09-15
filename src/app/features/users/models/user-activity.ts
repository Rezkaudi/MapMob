import { UserActivityType } from './user-activity-type';

export interface UserActivity {
  readonly id: string;
  readonly type: UserActivityType;
  readonly description: string;
  readonly occurredAt: string;
}
