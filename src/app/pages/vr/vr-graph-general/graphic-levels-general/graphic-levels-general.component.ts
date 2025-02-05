import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../../components/universal-graph.components';
import { environment } from '../../../../../environments/environment'; // Импортируем environment

@Component({
  selector: 'app-graphic-levels-general-vr',
  templateUrl: './graphic-levels-general.component.html',
  styleUrls: ['./graphic-levels-general.component.scss'],
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
})
export class GraphicLevelsGeneralVrComponent {
  timeRange: number = 10; // Устанавливаем 10 минут по умолчанию
  activeButton: number = 10; // Устанавливаем активную кнопку по умолчанию на 10 минут

  // Идентификаторы ПК
  vr1Id: string = 'vr1';
  vr2Id: string = 'vr2';

  // Номера ПК
  vr1Number: string = this.vr1Id.replace('vr', '');
  vr2Number: string = this.vr2Id.replace('vr', '');

  // Массивы для ПК 1
  vr1ApiUrls: string[] = [
    `${environment.apiUrl}/api/${this.vr1Id}/data`,
    `${environment.apiUrl}/api/${this.vr1Id}/data`,
  ];
  vr1ParameterNamesList: string[][] = [
    ['В барабане котла'],
    ['ИМ5 котел-утилизатор'],
  ];
  vr1DataKeys: string[] = ['levels', 'im']; // Ключи для данных из API

  // Массивы для ПК 2
  vr2ApiUrls: string[] = [
    `${environment.apiUrl}/api/${this.vr2Id}/data`,
    `${environment.apiUrl}/api/${this.vr2Id}/data`,
  ];
  vr2ParameterNamesList: string[][] = [
    ['В барабане котла'],
    ['ИМ5 котел-утилизатор'],
  ];
  vr2DataKeys: string[] = ['levels', 'im']; // Ключи для данных из API

  customNames: string[][] = [
    ['Уровень в барабане котла'],
    ['Процент открытия ИМ'],
  ];

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
