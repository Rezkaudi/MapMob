import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { PeriodChartState } from '../models/period-chart-state';

export interface PeriodChartReload<TData> {
  readonly readChart: () => PeriodChartState<TData>;
  readonly writeChart: (chart: PeriodChartState<TData>) => void;
  readonly load: (period: ChartPeriod) => Observable<TData>;
  readonly reportError: (message: string) => void;
}

/** Call inside `withMethods`: it needs an injection context. A newer tab cancels the older request. */
export function reloadPeriodChart<TData>(reload: PeriodChartReload<TData>) {
  return rxMethod<ChartPeriod>(
    pipe(
      tap((period) => reload.writeChart({ ...reload.readChart(), period, isLoading: true })),
      switchMap((period) =>
        reload.load(period).pipe(
          tap((data) => reload.writeChart({ period, data, isLoading: false })),
          catchError((error: Error) => {
            reload.writeChart({ ...reload.readChart(), isLoading: false });
            reload.reportError(error.message);
            return of(null);
          }),
        ),
      ),
    ),
  );
}
