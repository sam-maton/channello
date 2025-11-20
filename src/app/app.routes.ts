import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'child/feed',
    pathMatch: 'full',
  },
  {
    path: 'child/feed',
    loadComponent: () =>
      import('./pages/child/feed/feed.page').then((m) => m.FeedPage),
  },
  {
    path: 'video/:id',
    loadComponent: () =>
      import('./pages/child/video/video.page').then((m) => m.VideoPage),
  },
];
