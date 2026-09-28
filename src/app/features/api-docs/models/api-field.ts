/** One parameter, body field or response field. */
export interface ApiField {
  readonly name: string;
  readonly type: string;
  readonly isRequired: boolean;
  readonly description: string;
}
