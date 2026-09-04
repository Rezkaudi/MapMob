import { UserStatus } from './user-status';

export interface AppUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly accountType: string;
  readonly registeredAt: string;
  readonly lastActiveLabel: string;
  readonly status: UserStatus;
}
