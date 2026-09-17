/** A user or a store that can be picked one by one as a recipient. */
export interface NotificationRecipient {
  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly city: string;
}
