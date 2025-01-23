import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';
import { environment } from '../../../../environments/environment'; // Импортируем environment

@Component({
  selector: 'app-graphic-mpa-general',
  templateUrl: './mpa-graph-general.component.html',
  styleUrls: ['./mpa-graph-general.component.scss'],
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
})
export class GraphicMpaGeneralComponent {
  timeRange: number = 10; // Устанавливаем 10 минут по умолчанию
  activeButton: number = 10; // Устанавливаем активную кнопку по умолчанию на 10 минут

  // Идентификаторы МПА
  mpa2Id: string = 'mpa2';
  mpa3Id: string = 'mpa3';

  // Уникальные идентификаторы для графиков
  mpa2IdTemper: string = 'mpa2-temper';
  mpa2IdPressure: string = 'mpa2-pressure';
  mpa3IdTemper: string = 'mpa3-temper';
  mpa3IdPressure: string = 'mpa3-pressure';

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

  // Массивы для МПА 2 (давления)
  mpa2PressureParameterNamesList: string[][] = [
    [
      'Разрежение дымовой боров МПА2',
      'Давление воздух левый МПА2',
      'Давление воздух правый МПА2',
      'Давление низ ближний левый МПА2',
      'Давление низ ближний правый МПА2',
      'Давление середина ближняя левый МПА2',
      'Давление середина ближняя правый МПА2',
      'Давление середина дальняя левый МПА2',
      'Давление середина дальняя правый МПА2',
      'Давление верх дальний левый МПА2',
      'Давление верх дальний правый МПА2',
    ],
  ];

  mpaPressuresCustomNames: string[][] = [
    [
      'ДБ',
      'Воз.Лев',
      'Воз.Прав',
      'НБЛ',
      'НБП',
      'СБЛ',
      'СБП',
      'СДЛ',
      'СДП',
      'ВДЛ',
      'ВДП',
    ],
  ];

  mpaPressuresUnits: string[] = ['кгс/см2'];

  mpa2PressureDataKeys: string[] = ['pressures', 'data']; // Ключи для данных из API

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

  // Массивы для МПА 3 (давления)
  mpa3PressureParameterNamesList: string[][] = [
    [
      'Разрежение дымовой боров МПА3',
      'Давление воздух левый МПА3',
      'Давление воздух правый МПА3',
      'Давление низ ближний левый МПА3',
      'Давление низ ближний правый МПА3',
      'Давление середина ближняя левый МПА3',
      'Давление середина ближняя правый МПА3',
      'Давление середина дальняя левый МПА3',
      'Давление середина дальняя правый МПА3',
      'Давление верх дальний левый МПА3',
      'Давление верх дальний правый МПА3',
    ],
  ];
  mpa3PressureDataKeys: string[] = ['pressures', 'data']; // Ключи для данных из API

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
