/** The small card under the question that names the thing being acted on. */
export interface ConfirmActionContext {
  readonly lines: readonly string[];
  /** null draws the grey tile alone. */
  readonly imageUrl: string | null;
  /** A short fact set at the far end of the first line, e.g. "الحالة: نشطة". */
  readonly tag?: string;
}
