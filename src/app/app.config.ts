import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { SushilkaComponent } from './pages/sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemoComponent } from './pages/sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { SushilkaGraphVacuumsComponent } from './pages/sushilki/sushilka-graph-davl/sushilka-graph-vacuums.component';
import { SushilkaGraphTemperComponent } from './pages/sushilki/sushilka-graph-temper/sushilka-graph-temper.component';
import { EnergyResourcesCurrentComponent } from './pages/energy-resources/energy-resources-current/energy-resources-current.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent }, // Главная страница
      { path: 'sushilka/:id/current', component: SushilkaComponent },
      { path: 'sushilka/:id/mnemo', component: SushilkaMnemoComponent },
      {
        path: 'sushilka/:id/graph-vacuums',
        component: SushilkaGraphVacuumsComponent,
      },
      {
        path: 'sushilka/:id/graph-tempers',
        component: SushilkaGraphTemperComponent,
      },
      {
        path: 'energy-resources/current',
        component: EnergyResourcesCurrentComponent,
      },
    ]),
    provideHttpClient(),
    provideAnimations(), // Подключаем анимации правильно
  ],
};
