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
import { GraphicMpaGeneralComponent } from './pages/mpa/mpa-graph-general/mpa-graph-general.component';
import { EnergyResourcesGraphConsumptionComponent } from './pages/energy-resources/energy-resources-graph-consumption/energy-resources-graph-consumption.component';
import { MillsCurrentComponent } from './pages/mills/mills-current/mills-current.component';
import { Mill1GraphComponent } from './pages/mills/mill1-graph/mill1-graph.component';
import { Mill2GraphComponent } from './pages/mills/mill2-graph/mill2-graph.component';
import { MillSBM3Component } from './pages/mills/mill-sbm3/mill-sbm3.component';
import { MillYGM9517Component } from './pages/mills/mill-ygm9517/mill-ygm9517.component';
import { MillYCVOK130Component } from './pages/mills/mill-ycvok130/mill-ycvok130.component';
import { ReactorComponent } from './pages/reactors/reactors-current/reactors.component';
import { ReactorMnemoComponent } from './pages/reactors/reactors-mnemo/reactors-mnemo.component';
import { VrComponent } from './pages/vr/vr-current/vr.component';
import { VrMnemoComponent } from './pages/vr/vr-mnemo/vr-mnemo.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MpaGraphGeneralPressureComponent } from './pages/mpa/mpa-graph-general-pressure/mpa-graph-general-pressure.component';
import { MpaGraphGeneralTemperComponent } from './pages/mpa/mpa-graph-general-temper/mpa-graph-general-temper.component';
import { GraphicLevelsGeneralVrComponent } from './pages/vr/vr-graph-general/graphic-levels-general/graphic-levels-general.component';
import { GraphicTempersGeneralVrComponent } from './pages/vr/vr-graph-general/graphic-tempers-general/graphic-tempers-general.component';
import { GraphicVacuumsGeneralVrComponent } from './pages/vr/vr-graph-general/graphic-vacuums-general/graphic-vacuums-general.component';
import { GraphicNotisGeneralVrComponent } from './pages/vr/vr-graph-general/graphic-notis-general/graphic-notis-general.component';
import { ReactorsPressChartTemperGeneralComponent } from './pages/reactors/reactors-press-chart-temper-general/reactors-press-chart-temper-general.component';
import { ReactorsPressChartPressureGeneralComponent } from './pages/reactors/reactors-press-chart-pressure-general/reactors-press-chart-pressure-general.component';
import { GraphicReactorsGeneralComponent } from './pages/reactors/reactors-graph-general/reactors-graph-general.component';

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
        path: 'energy-resources/graph-consumption',
        component: EnergyResourcesGraphConsumptionComponent,
      },
      {
        path: 'mpa/:id/current',
        component: MpaComponent,
      },
      {
        path: 'mpa/:id/mnemo',
        component: MpaMnemoComponent,
      },
      {
        path: 'mpa/grah-general',
        component: GraphicMpaGeneralComponent,
      },
      {
        path: 'mpa/grah-general-temper',
        component: MpaGraphGeneralTemperComponent,
      },
      {
        path: 'mpa/grah-general-pressure',
        component: MpaGraphGeneralPressureComponent,
      },
      {
        path: 'mills/current',
        component: MillsCurrentComponent,
      },
      {
        path: 'mills/graph-mill1',
        component: Mill1GraphComponent,
      },
      {
        path: 'mills/graph-mill2',
        component: Mill2GraphComponent,
      },
      {
        path: 'mills/graph-sbm3',
        component: MillSBM3Component,
      },
      {
        path: 'mills/graph-ygm9517',
        component: MillYGM9517Component,
      },
      {
        path: 'mills/graph-ycvok130',
        component: MillYCVOK130Component,
      },
      {
        path: 'reactors/current',
        component: ReactorComponent,
      },
      {
        path: 'reactors/mnemo',
        component: ReactorMnemoComponent,
      },
      {
        path: 'reactors/graph-reactors-general',
        component: GraphicReactorsGeneralComponent,
      },
      {
        path: 'reactors/reactors-press-chart-temper-general',
        component: ReactorsPressChartTemperGeneralComponent,
      },
      {
        path: 'reactors/reactors-press-chart-pressure-general',
        component: ReactorsPressChartPressureGeneralComponent,
      },
      { path: 'vr/:id/current', component: VrComponent },
      { path: 'vr/:id/mnemo', component: VrMnemoComponent },
      {
        path: 'vr/graph-temper-general',
        component: GraphicTempersGeneralVrComponent,
      },
      {
        path: 'vr/graph-levels-general',
        component: GraphicLevelsGeneralVrComponent,
      },
      {
        path: 'vr/graph-vacuums-general',
        component: GraphicVacuumsGeneralVrComponent,
      },
      {
        path: 'vr/graph-notis-general',
        component: GraphicNotisGeneralVrComponent,
      },
    ]),
    provideHttpClient(),
    MatSnackBarModule,
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'ru' },
    provideAnimationsAsync(),
  ],
};
