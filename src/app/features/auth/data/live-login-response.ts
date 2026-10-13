export interface LiveLoginResponse {
  readonly user: {
    readonly id: number;
    readonly name: string;
    readonly role: string;
  };
  readonly token: string;
}
