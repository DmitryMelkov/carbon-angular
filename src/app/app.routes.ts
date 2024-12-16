import { Routes } from '@angular/router';
import { Sushilka1Component } from './pages/sushilki/sushilka1-current/sushilka1.component';
import { Sushilka2Component } from './pages/sushilka2/sushilka2.component';

export const appRoutes: Routes = [
  { path: 'sushilka1', component: Sushilka1Component },
  { path: 'sushilka2', component: Sushilka2Component },
  { path: '', redirectTo: '/sushilka1', pathMatch: 'full' },
];
