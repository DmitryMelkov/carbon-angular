import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { SushilkaComponent } from './pages/sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemo1Component } from './pages/sushilki/sushilka-mnemo/sushilka-mnemo-1.component';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'sushilka/:id', component: SushilkaComponent },
      { path: 'sushilka/:id/mnemo-1', component: SushilkaMnemo1Component }
    ]),
    provideHttpClient(),
    provideAnimations(), // Подключаем анимации правильно
  ],
};
