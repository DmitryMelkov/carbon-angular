import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mpa-graph-general-temper',
  imports: [ControlButtonComponent, UniversalGraphComponent],
  templateUrl: './mpa-graph-general-temper.component.html',
  styleUrl: './mpa-graph-general-temper.component.scss',
})
export class MpaGraphGeneralTemperComponent {
  timeRange: number = 10; // Устанавливаем 10 минут по умолчанию
  activeButton: number = 10; // Устанавливаем активную кнопку по умолчанию на 10 минут

  // Идентификаторы МПА
  mpa2Id: string = 'mpa2';
  mpa3Id: string = 'mpa3';

  // Уникальные идентификаторы для графиков
  mpa2IdTemper: string = 'mpa2-temper';
  mpa3IdTemper: string = 'mpa3-temper';

  // Номера МПА
  mpa2Number: string = this.mpa2Id.replace('mpa', '');
  mpa3Number: string = this.mpa3Id.replace('mpa', '');

  // Массивы для МПА 2 (температуры)
  mpa2ApiUrls: string[] = [`${environment.apiUrl}/api/${this.mpa2Id}/data`];

  mpa2TemperatureParameterNamesList: string[][] = [
    [
      'Температура верх регенератора левый МПА2',
      'Температура верх ближний левый МПА2',
      'Температура верх дальний левый МПА2',
      'Температура середина ближняя левый МПА2',
      'Температура середина дальняя левый МПА2',
      'Температура низ ближний левый МПА2',
      'Температура низ дальний левый МПА2',
      'Температура верх регенератора правый МПА2',
      'Температура верх ближний правый МПА2',
      'Температура верх дальний правый МПА2',
      'Температура середина ближняя правый МПА2',
      'Температура середина дальняя правый МПА2',
      'Температура низ ближний правый МПА2',
      'Температура низ дальний правый МПА2',
      'Температура камера сгорания МПА2',
      'Температура дымовой боров МПА2',
    ],
  ];

  mpaTemperatureCustomNames: string[][] = [
    [
      'ВРЛ',
      'ВБЛ',
      'ВДЛ',
      'СБЛ',
      'СДЛ',
      'НБЛ',
      'НДЛ',
      'ВРП',
      'ВБП',
      'ВДП',
      'СБП',
      'СДП',
      'НБП',
      'НДП',
      'КС',
      'ДБ',
    ],
  ];

  mpa2TemperatureDataKeys: string[] = ['temperatures', 'data']; // Ключи для данных из API

  // Массивы для МПА 3 (температуры)
  mpa3ApiUrls: string[] = [`${environment.apiUrl}/api/${this.mpa3Id}/data`];

  mpa3TemperatureParameterNamesList: string[][] = [
    [
      'Температура верх регенератора левый МПА3',
      'Температура верх ближний левый МПА3',
      'Температура верх дальний левый МПА3',
      'Температура середина ближняя левый МПА3',
      'Температура середина дальняя левый МПА3',
      'Температура низ ближний левый МПА3',
      'Температура низ дальний левый МПА3',
      'Температура верх регенератора правый МПА3',
      'Температура верх ближний правый МПА3',
      'Температура верх дальний правый МПА3',
      'Температура середина ближняя правый МПА3',
      'Температура середина дальняя правый МПА3',
      'Температура низ ближний правый МПА3',
      'Температура низ дальний правый МПА3',
      'Температура камера сгорания МПА3',
      'Температура дымовой боров МПА3',
    ],
  ];

  mpa3TemperatureDataKeys: string[] = ['temperatures', 'data']; // Ключи для данных из API

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
