/** Proof that the merchant owns the email; it lets them set one new password. */
export interface PasswordResetGrant {
  readonly resetToken: string;
}
