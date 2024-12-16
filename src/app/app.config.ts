import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Sushilka1Component } from './pages/sushilki/sushilka1-current/sushilka1.component';
import { Sushilka2Component } from './pages/sushilki/sushilka2-current/sushilka2.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'sushilka1', component: Sushilka1Component },
      { path: 'sushilka2', component: Sushilka2Component },
      { path: '', redirectTo: '/sushilka1', pathMatch: 'full' },
    ]),
    provideHttpClient(), // Добавляем провайдер для HttpClient
  ],
};
