import { Routes } from '@angular/router';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/report-overview/report-overview').then((m) => m.ReportOverview),
  },
];
