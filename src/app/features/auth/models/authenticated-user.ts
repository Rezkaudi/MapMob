export interface AuthenticatedUser {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly avatarUrl: string | null;
  readonly token: string;
}
