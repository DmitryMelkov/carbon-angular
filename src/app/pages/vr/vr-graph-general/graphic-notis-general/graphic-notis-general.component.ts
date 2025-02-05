import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../../components/universal-graph.components';
import { environment } from '../../../../../environments/environment'; // Импортируем environment

@Component({
  selector: 'app-graphic-notis-general-vr',
  templateUrl: './graphic-notis-general.component.html',
  styleUrls: ['./graphic-notis-general.component.scss'],
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
})
export class GraphicNotisGeneralVrComponent {
  timeRange: number = 10; // Устанавливаем 10 минут по умолчанию
  activeButton: number = 10; // Устанавливаем активную кнопку по умолчанию на 10 минут

  // Идентификаторы ПК
  notis1Id: string = 'notis1';
  notis2Id: string = 'notis2';

  // Номера ПК
  notis1Number: string = this.notis1Id.replace('notis', '');
  notis2Number: string = this.notis2Id.replace('notis', '');

  // Массивы для ПК 1
  notis1ApiUrls: string[] = [
    `${environment.apiUrl}/api/${this.notis1Id}/data`,
  ];
  notis1ParameterNamesList: string[][] = [
    ['Доза (кг/ч) НОТИС1'],
  ];
  notis1DataKeys: string[] = ['data']; // Ключи для данных из API

  // // Массивы для ПК 2
  notis2ApiUrls: string[] = [
    `${environment.apiUrl}/api/${this.notis2Id}/data`
  ];
  notis2ParameterNamesList: string[][] = [
    ['Доза (кг/ч) НОТИС2'],
  ];
  notis2DataKeys: string[] = ['data']; // Ключи для данных из API

  customNames: string[][] = [
    ['Загрузка'],
  ];

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
