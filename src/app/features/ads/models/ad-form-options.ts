export interface AdFormPlace {
  readonly id: string;
  readonly name: string;
}

export interface AdFormOptions {
  readonly places: readonly AdFormPlace[];
}
