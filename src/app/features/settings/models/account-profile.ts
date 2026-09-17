export interface AccountProfile {
  readonly fullName: string;
  readonly email: string;
  /** Written as the badge shows it, e.g. "مسؤول النظام الرئيسي (Super Admin)". */
  readonly roleName: string;
}
