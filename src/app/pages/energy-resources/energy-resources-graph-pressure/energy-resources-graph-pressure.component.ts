import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';
import { environment } from '../../../../environments/environment'; // Импортируем environment

@Component({
  selector: 'app-energy-resources-graph-pressure',
  standalone: true,
  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './energy-resources-graph-pressure.component.html',
  styleUrls: ['./energy-resources-graph-pressure.component.scss'],
})
export class EnergyResourcesGraphPressureComponent {
  // Параметры для графика давления
  apiUrls: string[] = [
    `${environment.apiUrl}/api/de093/data`,
    `${environment.apiUrl}/api/dd972/data`,
    `${environment.apiUrl}/api/dd973/data`,
    `${environment.apiUrl}/api/dd576/data`,
    `${environment.apiUrl}/api/dd569/data`,
    `${environment.apiUrl}/api/dd923/data`,
    `${environment.apiUrl}/api/DD924/data`,
  ];
  parameterNamesList: string[][] = [
    ['Давление DE093'],
    ['Давление DD972'],
    ['Давление DD973'],
    ['Давление DD576'],
    ['Давление DD569'],
    ['Давление DD923'],
    ['Давление DD924'],
  ];
  customNames: string[][] = [
    ['МПА2'],
    ['МПА3'],
    ['МПА4'],
    ['к.10в1'],
    ['От к.265 до к.10в1'],
    ['Котел утилизатор №1'],
    ['Котел утилизатор №2'],
  ];
  dataKeys: string[] = ['data', 'data', 'data', 'data', 'data', 'data', 'data']; // Ключи для данных из API
  yAxisTitle: string = 'Давление, кгс/см²';
  title: string = 'График давления узлов учета';
  yAxisRange: { min: number; max: number } = { min: 0, max: 0.5 };
  timeRange: number = 30;
}
