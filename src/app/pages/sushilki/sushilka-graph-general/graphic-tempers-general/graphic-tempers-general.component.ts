import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../../components/universal-graph.components';
import { environment } from '../../../../../environments/environment'; // Импортируем environment

@Component({
  selector: 'app-graphic-tempers-general',
  templateUrl: './graphic-tempers-general.component.html',
  styleUrls: ['./graphic-tempers-general.component.scss'],
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
})
export class GraphicTempersGeneralComponent {
  timeRange: number = 10; // Устанавливаем 10 минут по умолчанию
  activeButton: number = 10; // Устанавливаем активную кнопку по умолчанию на 10 минут

  // Идентификаторы сушилок
  sushilka1Id: string = 'sushilka1';
  sushilka2Id: string = 'sushilka2';

  // Номера сушилок
  sushilka1Number: string = this.sushilka1Id.replace('sushilka', '');
  sushilka2Number: string = this.sushilka2Id.replace('sushilka', '');

  // Массивы для сушилки 1
  sushilka1ApiUrls: string[] = [
    `${environment.apiUrl}/api/${this.sushilka1Id}/data`,
  ];
  sushilka1ParameterNamesList: string[][] = [
    [
      'Температура в топке',
      'Температура в камере смешения',
      'Температура уходящих газов',
    ], // Параметры для первого API
  ];
  sushilka1DataKeys: string[] = ['temperatures', 'data']; // Ключи для данных из API

  // Массивы для сушилки 2
  sushilka2ApiUrls: string[] = [
    `${environment.apiUrl}/api/${this.sushilka2Id}/data`,
  ];
  sushilka2ParameterNamesList: string[][] = [
    [
      'Температура в топке',
      'Температура в камере смешения',
      'Температура уходящих газов',
    ], // Параметры для первого API
  ];
  sushilka2DataKeys: string[] = ['temperatures', 'data']; // Ключи для данных из API

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
