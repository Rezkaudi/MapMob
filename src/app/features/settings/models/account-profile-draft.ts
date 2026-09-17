import { AccountProfile } from './account-profile';

export type AccountProfileDraft = Pick<AccountProfile, 'fullName' | 'email'>;
