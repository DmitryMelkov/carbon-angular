import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushilkaComponent } from '../sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemoComponent } from '../sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ControlButtonComponent } from '../../components/control-button/control-button.component';
import { GraphicVacuumsGeneralComponent } from './graphic-vacuums-general/graphic-vacuums-general.component';
import { GraphicTempersGeneralComponent } from './graphic-tempers-general/graphic-tempers-general.component';
import { EnergyResourcesCurrentComponent } from '../energy-resources/energy-resources-current/energy-resources-current.component';

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
    | 'energy-resources' = 'parameters'; // Добавьте новое состояние для энергоресурсов

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
}
