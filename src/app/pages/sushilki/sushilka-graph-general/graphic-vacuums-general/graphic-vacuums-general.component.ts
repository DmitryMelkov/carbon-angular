import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../../components/universal-graph.components';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-graphic-vacuums-general',
  templateUrl: './graphic-vacuums-general.component.html',
  styleUrls: ['./graphic-vacuums-general.component.scss'],
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
})
export class GraphicVacuumsGeneralComponent {
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
      'Разрежение в топке',
      'Разрежение в камере выгрузки',
      // 'Разрежение воздуха на разбавление',
    ], // Параметры для первого API
  ];
  sushilka1DataKeys: string[] = ['vacuums', 'data']; // Ключи для данных из API

  // Массивы для сушилки 2
  sushilka2ApiUrls: string[] = [
    `${environment.apiUrl}/api/${this.sushilka2Id}/data`,
  ];
  sushilka2ParameterNamesList: string[][] = [
    [
      'Разрежение в топке',
      'Разрежение в камере выгрузки',
      // 'Разрежение воздуха на разбавление',
    ], // Параметры для первого API
  ];
  sushilka2DataKeys: string[] = ['vacuums', 'data']; // Ключи для данных из API

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
