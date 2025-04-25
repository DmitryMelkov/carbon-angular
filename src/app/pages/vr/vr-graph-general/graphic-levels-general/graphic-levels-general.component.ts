import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../../components/universal-graph.components';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-graphic-levels-general-vr',
  templateUrl: './graphic-levels-general.component.html',
  styleUrls: ['./graphic-levels-general.component.scss'],
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
})
export class GraphicLevelsGeneralVrComponent {
  timeRange: number = 10;
  activeButton: number = 10;

  // Идентификаторы ПК
  vr1Id: string = 'vr1';
  vr2Id: string = 'vr2';

  // Номера ПК
  vr1Number: string = this.vr1Id.replace('vr', '');
  vr2Number: string = this.vr2Id.replace('vr', '');

  // Подключа для каждого параметра (все в процентах)
  subKeys: string[] = ['percent', 'percent', 'percent'];

  // Массивы для ПК 1
  vr1ApiUrls: string[] = [
    `${environment.apiUrl}/api/${this.vr1Id}/data`,
    `${environment.apiUrl}/api/${this.vr1Id}/data`,
    `${environment.apiUrl}/api/${this.vr1Id}/data`
  ];
  vr1ParameterNamesList: string[][] = [
    ['В барабане котла'],
    ['ИМ5 котел-утилизатор'],
    ['В емкости ХВО']
  ];
  vr1DataKeys: string[] = ['levels', 'im', 'levels']; // Ключи для данных из API

  // Массивы для ПК 2
  vr2ApiUrls: string[] = [
    `${environment.apiUrl}/api/${this.vr2Id}/data`,
    `${environment.apiUrl}/api/${this.vr2Id}/data`,
    `${environment.apiUrl}/api/${this.vr2Id}/data`
  ];
  vr2ParameterNamesList: string[][] = [
    ['В барабане котла'],
    ['ИМ5 котел-утилизатор'],
    ['В емкости ХВО']
  ];
  vr2DataKeys: string[] = ['levels', 'im', 'levels']; // Ключи для данных из API

  customNames: string[][] = [
    ['Уровень в барабане котла (-200..200 мм)'],
    ['Процент открытия ИМ'],
    ['Уровень в емкости ХВО (0...6000 мм)']
  ];

  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes;
  }
}