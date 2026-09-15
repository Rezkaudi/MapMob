import { ActivationStatus } from '../../../shared/models/activation-status';
import { UserAccountType } from './user-account-type';

export interface AppUser {
  readonly id: string;
  readonly name: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly accountType: UserAccountType;
  readonly governorateName: string;
  readonly registeredAt: string;
  readonly lastActiveAt: string;
  readonly status: ActivationStatus;
}
