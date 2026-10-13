/** The live server wraps most answers in `{ data }`. */
export interface LiveEnvelope<T> {
  readonly data: T;
}
