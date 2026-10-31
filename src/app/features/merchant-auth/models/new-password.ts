export interface NewPassword {
  readonly email: string;
  readonly resetToken: string;
  readonly password: string;
}
