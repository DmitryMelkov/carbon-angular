import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../../components/universal-graph.components';
import { environment } from '../../../../../environments/environment'; // Импортируем environment

@Component({
  selector: 'app-graphic-vacuums-general-vr',
  templateUrl: './graphic-vacuums-general.component.html',
  styleUrls: ['./graphic-vacuums-general.component.scss'],
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
})
export class GraphicVacuumsGeneralVrComponent {
  timeRange: number = 10; // Устанавливаем 10 минут по умолчанию
  activeButton: number = 10; // Устанавливаем активную кнопку по умолчанию на 10 минут

  // Идентификаторы ПК
  vr1Id: string = 'vr1';
  vr2Id: string = 'vr2';

  // Номера ПК
  vr1Number: string = this.vr1Id.replace('vr', '');
  vr2Number: string = this.vr2Id.replace('vr', '');

  // Массивы для ПК 1
  vr1ApiUrls: string[] = [`${environment.apiUrl}/api/${this.vr1Id}/data`, `${environment.apiUrl}/api/${this.vr1Id}/data`];
  vr1ParameterNamesList: string[][] = [
    ['Давление газов после скруббера', 'Пара в барабане котла'],
    ['В топке печи', 'Низ загрузочной камеры', 'В котле утилизаторе'],
  ];
  vr1DataKeys: string[] = ['pressures', 'vacuums']; // Ключи для данных из API

  // Массивы для ПК 2
  vr2ApiUrls: string[] = [`${environment.apiUrl}/api/${this.vr2Id}/data`, `${environment.apiUrl}/api/${this.vr2Id}/data`];
  vr2ParameterNamesList: string[][] = [
    ['Давление газов после скруббера', 'Пара в барабане котла'],
    ['В топке печи', 'Низ загрузочной камеры', 'В котле утилизаторе'],
  ];
  vr2DataKeys: string[] = ['pressures', 'vacuums']; // Ключи для данных из API

  customNames: string[][] = [
    ['Давление газов после скруббера', 'Давление пара в барабане котла'],
    ['Разрежение в топке печи', 'Разрежение внизу камеры загрузки', 'Разрежение в котле утилизаторе', ],
  ];

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
