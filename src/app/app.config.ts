import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { SushilkaComponent } from './pages/sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemoComponent } from './pages/sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { SushilkaGraphVacuumsComponent } from './pages/sushilki/sushilka-graph-davl/sushilka-graph-vacuums.component';
import { SushilkaGraphTemperComponent } from './pages/sushilki/sushilka-graph-temper/sushilka-graph-temper.component';
import { EnergyResourcesCurrentComponent } from './pages/energy-resources/energy-resources-current/energy-resources-current.component';
import { EnergyResourcesReportDayComponent } from './pages/energy-resources/energy-resources-report-day/energy-resources-report-day.component';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { EnergyResourcesReportMonthComponent } from './pages/energy-resources/energy-resources-report-month/energy-resources-report-month.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EnergyResourcesGraphPressureComponent } from './pages/energy-resources/energy-resources-graph-pressure/energy-resources-graph-pressure.component';
import { MpaComponent } from './pages/mpa/mpa-current/mpa.component';
import { MpaMnemoComponent } from './pages/mpa/mpa-mnemo/mpa-mnemo.component';

registerLocaleData(localeRu); // Зарегистрируйте локаль

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent },
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
      {
        path: 'energy-resources/report-day',
        component: EnergyResourcesReportDayComponent,
      },
      {
        path: 'energy-resources/report-month',
        component: EnergyResourcesReportMonthComponent,
      },
      {
        path: 'energy-resources/graph-pressure',
        component: EnergyResourcesGraphPressureComponent,
      },
      {
        path: 'mpa/:id/current',
        component: MpaComponent,
      },
      {
        path: 'mpa/:id/mnemo',
        component: MpaMnemoComponent,
      },
    ]),
    provideHttpClient(),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'ru' },
    provideAnimationsAsync(),
  ],
};

