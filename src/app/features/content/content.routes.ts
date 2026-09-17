import { Routes } from '@angular/router';

const loadLegalPageEditor = () =>
  import('./pages/legal-page-editor/legal-page-editor').then((m) => m.LegalPageEditor);

export const CONTENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/content-page-list/content-page-list').then((m) => m.ContentPageList),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about-page-editor/about-page-editor').then((m) => m.AboutPageEditor),
  },
  { path: 'terms', loadComponent: loadLegalPageEditor, data: { kind: 'terms' } },
  { path: 'privacy', loadComponent: loadLegalPageEditor, data: { kind: 'privacy' } },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact-page-editor/contact-page-editor').then((m) => m.ContactPageEditor),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq-page/faq-page').then((m) => m.FaqPage),
  },
];
