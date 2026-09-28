/** Where the merchant is in "forgot password": email → code → new password → done. */
export type PasswordResetStep = 'email' | 'code' | 'password' | 'done';
