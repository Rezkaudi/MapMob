export interface LiveUser {
  readonly id: number;
  readonly name: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly status: string;
  /** The governorate of the location the user picked. The list sends it under this name. */
  readonly 'SELECTED LOCATION'?: string | null;
  readonly lastActiveAt: string | null;
  /** null until the user confirms the sign-up code; the server counts such an account as a visitor. Not in every reply. */
  readonly email_verified_at?: string | null;
  readonly created_at: string;
}
