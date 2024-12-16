import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { SushilkaComponent } from './pages/sushilki/sushilka-current/sushilka.component';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'sushilka/:id', component: SushilkaComponent },
      { path: '', redirectTo: '/sushilka/sushilka1', pathMatch: 'full' },
    ]),
    provideHttpClient(), // Добавляем провайдер для HttpClient
  ],
};
