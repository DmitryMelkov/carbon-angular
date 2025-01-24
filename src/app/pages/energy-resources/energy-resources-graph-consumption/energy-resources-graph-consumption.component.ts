import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';
import { environment } from '../../../../environments/environment'; // Импортируем environment

@Component({
  selector: 'app-energy-resources-graph-consumption',
  standalone: true,
  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './energy-resources-graph-consumption.component.html',
  styleUrl: './energy-resources-graph-consumption.component.scss',
})
export class EnergyResourcesGraphConsumptionComponent {
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
    ['Тонн/ч DE093'],
    ['Тонн/ч DD972'],
    ['Тонн/ч DD973'],
    ['Тонн/ч DD576'],
    ['Тонн/ч DD569'],
    ['Тонн/ч DD923'],
    ['Тонн/ч DD924'],
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
  yAxisTitle: string = 'Расход, тонн/ч';
  title: string = 'График расхода пара';
  yAxisRange: { min: number; max: number } = { min: 0, max: 5 };
  timeRange: number = 30;
}
