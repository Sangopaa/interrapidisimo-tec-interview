import { Routes } from '@angular/router';
import { Posts } from './features/posts/posts';

export const routes: Routes = [
  { path: 'posts', component: Posts },
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: '**', redirectTo: 'posts' },
];
