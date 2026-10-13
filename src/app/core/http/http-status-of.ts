/** Both HttpErrorResponse and ApiError carry the HTTP status. */
export function httpStatusOf(error: unknown): number | null {
  const status = (error as { status?: unknown } | null)?.status;
  return typeof status === 'number' ? status : null;
}
