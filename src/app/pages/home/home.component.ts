import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushilkaComponent } from '../sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemoComponent } from '../sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { MpaComponent } from '../mpa/mpa-current/mpa.component';
import { MpaMnemoComponent } from '../mpa/mpa-mnemo/mpa-mnemo.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ControlButtonComponent } from '../../components/control-button/control-button.component';
import { GraphicVacuumsGeneralComponent } from '../sushilki/sushilka-graph-general/graphic-vacuums-general/graphic-vacuums-general.component';
import { GraphicTempersGeneralComponent } from '../sushilki/sushilka-graph-general/graphic-tempers-general/graphic-tempers-general.component';
import { EnergyResourcesCurrentComponent } from '../energy-resources/energy-resources-current/energy-resources-current.component';
import { EnergyResourcesReportDayComponent } from '../energy-resources/energy-resources-report-day/energy-resources-report-day.component';
import { EnergyResourcesReportMonthComponent } from '../energy-resources/energy-resources-report-month/energy-resources-report-month.component';
import { EnergyResourcesGraphPressureComponent } from '../energy-resources/energy-resources-graph-pressure/energy-resources-graph-pressure.component';
import { EnergyResourcesGraphConsumptionComponent } from '../energy-resources/energy-resources-graph-consumption/energy-resources-graph-consumption.component';
import { GraphicMpaGeneralComponent } from "../mpa/mpa-graph-general/mpa-graph-general.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SushilkaComponent,
    SushilkaMnemoComponent,
    MpaComponent,
    MpaMnemoComponent,
    MatTabsModule,
    ControlButtonComponent,
    GraphicVacuumsGeneralComponent,
    GraphicTempersGeneralComponent,
    EnergyResourcesCurrentComponent,
    EnergyResourcesReportDayComponent,
    EnergyResourcesReportMonthComponent,
    EnergyResourcesGraphPressureComponent,
    EnergyResourcesGraphConsumptionComponent,
    GraphicMpaGeneralComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  objectData = [
    { id: 'mpa2', name: 'МПА №2', type: 'mpa' },
    { id: 'mpa3', name: 'МПА №3', type: 'mpa' },
    { id: 'sushilka1', name: 'Сушилка №1', type: 'sushilka' },
    { id: 'sushilka2', name: 'Сушилка №2', type: 'sushilka' },
  ];
  selectedObjectId: string = this.objectData[0].id; // Выбранный объект по умолчанию
  activeView:
    | 'parameters'
    | 'mnemo'
    | 'graph-vacuums-general'
    | 'graph-tempers-general'
    | 'graph-mpa-general'
    | 'energy-resources'
    | 'daily-report'
    | 'monthly-report'
    | 'energy-resources-graph-pressure'
    | 'energy-resources-graph-consumption' = 'parameters';

  // Метод для отображения текущих параметров
  showParameters(id: string) {
    this.selectedObjectId = id;
    this.activeView = 'parameters';
  }

  // Метод для отображения мнемосхемы
  showMnemo(id: string) {
    this.selectedObjectId = id;
    this.activeView = 'mnemo';
  }

  showGraphMpaGeneral(objectId: string) {
    this.activeView = 'graph-mpa-general';
    this.selectedObjectId = objectId;
  }

  // Метод для отображения графиков давления
  showGraphPressure(id: string) {
    this.selectedObjectId = id;
    this.activeView = 'graph-vacuums-general';
  }

  // Метод для отображения графиков температур
  showGraphTemper(id: string) {
    this.selectedObjectId = id;
    this.activeView = 'graph-tempers-general';
  }

  // Метод для отображения энергоресурсов
  showEnergyResources() {
    this.selectedObjectId = ''; // Сбросьте идентификатор, так как это не сушилка
    this.activeView = 'energy-resources';
  }

  // Метод для отображения суточного отчета
  showDailyReport() {
    this.selectedObjectId = ''; // Сбросьте идентификатор, так как это не сушилка
    this.activeView = 'daily-report';
  }

  // Метод для отображения месячного отчета
  showMonthlyReport() {
    this.selectedObjectId = ''; // Сбросьте идентификатор, так как это не сушилка
    this.activeView = 'monthly-report';
  }

  // Метод для отображения графиков давления в энергоресурсах
  showEnergyResourcesGraphPressure() {
    this.selectedObjectId = ''; // Сбросьте идентификатор, так как это не сушилка
    this.activeView = 'energy-resources-graph-pressure';
  }

  showEnergyResourcesGraphConsumption() {
    this.selectedObjectId = ''; // Сбросьте идентификатор, так как это не сушилка
    this.activeView = 'energy-resources-graph-consumption';
  }
}
