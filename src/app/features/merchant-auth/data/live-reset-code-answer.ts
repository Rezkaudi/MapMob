/** What POST /owner/auth/password/verify-code may send back; the server has not shown its shape yet. */
export interface LiveResetCodeAnswer {
  readonly recovery_token?: string | null;
  readonly recoveryToken?: string | null;
  readonly token?: string | null;
}
