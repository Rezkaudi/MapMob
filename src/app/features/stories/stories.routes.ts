import { Routes } from '@angular/router';

export const STORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/story-list/story-list').then((m) => m.StoryList),
  },
];
