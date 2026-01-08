import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'posts', loadComponent: () => import('./features/posts/posts').then((m) => m.Posts) },
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: '**', redirectTo: 'posts' },
];
