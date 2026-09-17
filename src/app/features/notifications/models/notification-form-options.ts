export interface NotificationArea {
  readonly id: string;
  readonly name: string;
}

export interface NotificationGovernorate {
  readonly id: string;
  readonly name: string;
  readonly areas: readonly NotificationArea[];
}

/** What the create and edit form loads before it can show its choices. */
export interface NotificationFormOptions {
  readonly governorates: readonly NotificationGovernorate[];
}
