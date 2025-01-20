import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushilkaComponent } from '../sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemoComponent } from '../sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ControlButtonComponent } from '../../components/control-button/control-button.component';
import { GraphicVacuumsGeneralComponent } from './graphic-vacuums-general/graphic-vacuums-general.component';
import { GraphicTempersGeneralComponent } from './graphic-tempers-general/graphic-tempers-general.component';
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
    SushilkaComponent,
    SushilkaMnemoComponent,
    MatTabsModule,
    ControlButtonComponent,
    GraphicVacuumsGeneralComponent,
    GraphicTempersGeneralComponent,
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
    { id: 'sushilka1', name: 'Сушилка №1' },
    { id: 'sushilka2', name: 'Сушилка №2' },
  ];
  selectedSushilkaId: string = this.objectData[0].id; // Выбранный объект по умолчанию
  activeView:
    | 'parameters'
    | 'mnemo'
    | 'graph-vacuums-general'
    | 'graph-tempers-general'
    | 'energy-resources'
    | 'daily-report'
    | 'monthly-report'
    | 'energy-resources-graph-pressure'
    | 'energy-resources-graph-consumption' = 'parameters'; // Добавляем новое состояние

  // Метод для отображения текущих параметров
  showParameters(id: string) {
    this.selectedSushilkaId = id;
    this.activeView = 'parameters';
  }

  // Метод для отображения мнемосхемы
  showMnemo(id: string) {
    this.selectedSushilkaId = id;
    this.activeView = 'mnemo';
  }

  // Метод для отображения графиков давления
  showGraphPressure(id: string) {
    this.selectedSushilkaId = id;
    this.activeView = 'graph-vacuums-general';
  }

  // Метод для отображения графиков температур
  showGraphTemper(id: string) {
    this.selectedSushilkaId = id;
    this.activeView = 'graph-tempers-general';
  }

  // Метод для отображения энергоресурсов
  showEnergyResources() {
    this.selectedSushilkaId = ''; // Сбросьте идентификатор, так как это не сушилка
    this.activeView = 'energy-resources'; // Устанавливаем активное представление
  }

  // Метод для отображения суточного отчета
  showDailyReport() {
    this.selectedSushilkaId = ''; // Сбросьте идентификатор, так как это не сушилка
    this.activeView = 'daily-report'; // Устанавливаем активное представление
  }

  // Метод для отображения месячного отчета
  showMonthlyReport() {
    this.selectedSushilkaId = ''; // Сбросьте идентификатор, так как это не сушилка
    this.activeView = 'monthly-report'; // Устанавливаем активное представление
  }

  // Метод для отображения графиков давления в энергоресурсах
  showEnergyResourcesGraphPressure() {
    this.selectedSushilkaId = ''; // Сбросьте идентификатор, так как это не сушилка
    this.activeView = 'energy-resources-graph-pressure'; // Устанавливаем активное представление
  }

  showEnergyResourcesGraphConsumption() {
    this.selectedSushilkaId = ''; // Сбросьте идентификатор, так как это не сушилка
    this.activeView = 'energy-resources-graph-consumption'; // Устанавливаем активное представление
  }
}
