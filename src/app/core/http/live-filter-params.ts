import { HttpParams } from '@angular/common/http';

export type LiveFilterValue = string | number | null | undefined;

/** Every filter with a value goes into the request; empty ones stay out. */
export function toLiveFilterParams(filters: Readonly<Record<string, LiveFilterValue>>): HttpParams {
  let params = new HttpParams();
  for (const [name, value] of Object.entries(filters)) {
    if (value !== null && value !== undefined && value !== '') {
      params = params.set(name, value);
    }
  }
  return params;
}
