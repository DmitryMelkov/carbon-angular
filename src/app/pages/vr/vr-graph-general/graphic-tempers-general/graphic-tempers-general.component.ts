import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../../components/universal-graph.components';
import { environment } from '../../../../../environments/environment'; // Импортируем environment

@Component({
  selector: 'app-graphic-tempers-general-vr',
  templateUrl: './graphic-tempers-general.component.html',
  styleUrls: ['./graphic-tempers-general.component.scss'],
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
})
export class GraphicTempersGeneralVrComponent {
  timeRange: number = 10; // Устанавливаем 10 минут по умолчанию
  activeButton: number = 10; // Устанавливаем активную кнопку по умолчанию на 10 минут

  // Идентификаторы ПК
  vr1Id: string = 'vr1';
  vr2Id: string = 'vr2';

  // Номера ПК
  vr1Number: string = this.vr1Id.replace('vr', '');
  vr2Number: string = this.vr2Id.replace('vr', '');

  // Массивы для ПК 1
  vr1ApiUrls: string[] = [`${environment.apiUrl}/api/${this.vr1Id}/data`];
  vr1ParameterNamesList: string[][] = [
    [
      'В топке',
      'Камеры выгрузки',
      '1-СК',
      '2-СК',
      '3-СК',
      'Вверху камеры загрузки',
      'Внизу камеры загрузки',
      'На входе печи дожига',
      'На выходе печи дожига',
      'Дымовых газов котла',
      'Газов до скруббера',
      'Газов после скруббера',
      'Воды в ванне скруббера',
      'Гранул после холод-ка',
    ],
  ];
  vr1DataKeys: string[] = ['temperatures', 'data']; // Ключи для данных из API

  // Массивы для ПК 2
  vr2ApiUrls: string[] = [`${environment.apiUrl}/api/${this.vr2Id}/data`];
  vr2ParameterNamesList: string[][] = [
    [
      'В топке',
      'Камеры выгрузки',
      '1-СК',
      '2-СК',
      '3-СК',
      'Вверху камеры загрузки',
      'Внизу камеры загрузки',
      'На входе печи дожига',
      'На выходе печи дожига',
      'Дымовых газов котла',
      'Газов до скруббера',
      'Газов после скруббера',
      'Воды в ванне скруббера',
      'Гранул после холод-ка',
    ],
  ];
  vr2DataKeys: string[] = ['temperatures', 'data']; // Ключи для данных из API

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
