import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ControlButtonComponent } from '../../components/control-button/control-button.component';
import { SushilkaComponent } from '../sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemoComponent } from '../sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { MpaComponent } from '../mpa/mpa-current/mpa.component';
import { MpaMnemoComponent } from '../mpa/mpa-mnemo/mpa-mnemo.component';
import { VrComponent } from '../vr/vr-current/vr.component';
import { VrMnemoComponent } from '../vr/vr-mnemo/vr-mnemo.component';
import { GraphicVacuumsGeneralComponent } from '../sushilki/sushilka-graph-general/graphic-vacuums-general/graphic-vacuums-general.component';
import { GraphicTempersGeneralComponent } from '../sushilki/sushilka-graph-general/graphic-tempers-general/graphic-tempers-general.component';
import { GraphicMpaGeneralComponent } from '../mpa/mpa-graph-general/mpa-graph-general.component';
import { MillsCurrentComponent } from '../mills/mills-current/mills-current.component';
import { Mill1GraphComponent } from '../mills/mill1-graph/mill1-graph.component';
import { Mill2GraphComponent } from '../mills/mill2-graph/mill2-graph.component';
import { MillSBM3Component } from '../mills/mill-sbm3/mill-sbm3.component';
import { MillYGM9517Component } from '../mills/mill-ygm9517/mill-ygm9517.component';
import { MillYCVOK130Component } from '../mills/mill-ycvok130/mill-ycvok130.component';
import { ReactorComponent } from '../reactors/reactors-current/reactors.component';
import { ReactorMnemoComponent } from '../reactors/reactors-mnemo/reactors-mnemo.component';
import { GraphicReactorsGeneralComponent } from '../reactors/reactors-graph-general/reactors-graph-general.component';
import { EnergyResourcesCurrentComponent } from '../energy-resources/energy-resources-current/energy-resources-current.component';
import { EnergyResourcesReportDayComponent } from '../energy-resources/energy-resources-report-day/energy-resources-report-day.component';
import { EnergyResourcesReportMonthComponent } from '../energy-resources/energy-resources-report-month/energy-resources-report-month.component';
import { EnergyResourcesGraphPressureComponent } from '../energy-resources/energy-resources-graph-pressure/energy-resources-graph-pressure.component';
import { EnergyResourcesGraphConsumptionComponent } from '../energy-resources/energy-resources-graph-consumption/energy-resources-graph-consumption.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    ControlButtonComponent,
    SushilkaComponent,
    SushilkaMnemoComponent,
    MpaComponent,
    MpaMnemoComponent,
    VrComponent,
    VrMnemoComponent,
    GraphicVacuumsGeneralComponent,
    GraphicTempersGeneralComponent,
    GraphicMpaGeneralComponent,
    MillsCurrentComponent,
    Mill1GraphComponent,
    Mill2GraphComponent,
    MillSBM3Component,
    MillYGM9517Component,
    MillYCVOK130Component,
    ReactorComponent,
    ReactorMnemoComponent,
    GraphicReactorsGeneralComponent,
    EnergyResourcesCurrentComponent,
    EnergyResourcesReportDayComponent,
    EnergyResourcesReportMonthComponent,
    EnergyResourcesGraphPressureComponent,
    EnergyResourcesGraphConsumptionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  objectData = [
    { id: 'vr1', name: 'ПК №1', type: 'vr' },
    { id: 'vr2', name: 'ПК №2', type: 'vr' },
    { id: 'mpa2', name: 'МПА №2', type: 'mpa' },
    { id: 'mpa3', name: 'МПА №3', type: 'mpa' },
    { id: 'sushilka1', name: 'Сушилка №1', type: 'sushilka' },
    { id: 'sushilka2', name: 'Сушилка №2', type: 'sushilka' },
  ];

  selectedObjectId: string = this.objectData[0].id;
  activeView: string = 'parameters';

  // Общий метод для изменения состояния
  setView(view: string, objectId: string = '') {
    this.activeView = view;
    this.selectedObjectId = objectId;
  }

  // Методы для отображения различных видов контента
  showParameters(id: string) {
    this.setView('parameters', id);
  }

  showMnemo(id: string) {
    this.setView('mnemo', id);
  }

  showGraphMpaGeneral(id: string) {
    this.setView('graph-mpa-general', id);
  }

  showGraphPressure(id: string) {
    this.setView('graph-vacuums-general', id);
  }

  showGraphTemper(id: string) {
    this.setView('graph-tempers-general', id);
  }

  showReactorsCurrent() {
    this.setView('reactors-current');
  }

  showReactorsMnemo() {
    this.setView('reactors-mnemo');
  }

  showReactorsGeneral() {
    this.setView('graph-reactors-general');
  }

  showEnergyResources() {
    this.setView('energy-resources');
  }

  showDailyReport() {
    this.setView('daily-report');
  }

  showMonthlyReport() {
    this.setView('monthly-report');
  }

  showEnergyResourcesGraphPressure() {
    this.setView('energy-resources-graph-pressure');
  }

  showEnergyResourcesGraphConsumption() {
    this.setView('energy-resources-graph-consumption');
  }

  showMillsCurrent() {
    this.setView('mills-current');
  }

  showMill1Graph() {
    this.setView('mill1-graph');
  }

  showMill2Graph() {
    this.setView('mill2-graph');
  }

  showMillsbm3Graph() {
    this.setView('millsbm3-graph');
  }

  showMillygm9517Graph() {
    this.setView('millygm9517-graph');
  }

  showMillycvok130Graph() {
    this.setView('millycvok130-graph');
  }
}
