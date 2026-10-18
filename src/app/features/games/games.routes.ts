import { Routes } from '@angular/router';

const loadGameForm = () => import('./pages/game-form/game-form').then((m) => m.GameForm);

export const GAMES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/game-hub/game-hub').then((m) => m.GameHub),
  },
  { path: 'new', loadComponent: loadGameForm },
  { path: ':id/edit', loadComponent: loadGameForm },
];
