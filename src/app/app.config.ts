import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { SushilkaComponent } from './pages/sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemoComponent } from './pages/sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent }, // Главная страница
      { path: 'sushilka/:id/current', component: SushilkaComponent },
      { path: 'sushilka/:id/mnemo', component: SushilkaMnemoComponent },
    ]),
    provideHttpClient(),
    provideAnimations(), // Подключаем анимации правильно
  ],
};
