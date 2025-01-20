import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';

@Component({
  selector: 'app-energy-resources-graph-consumption',
  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './energy-resources-graph-consumption.component.html',
  styleUrl: './energy-resources-graph-consumption.component.scss'
})
export class EnergyResourcesGraphConsumptionComponent {
  // Параметры для графика давления
  apiUrls: string[] = [
    'http://localhost:3002/api/de093/data',
    'http://localhost:3002/api/dd972/data',
    'http://localhost:3002/api/dd973/data',
    'http://localhost:3002/api/dd576/data',
    'http://localhost:3002/api/dd569/data',
    'http://localhost:3002/api/dd923/data',
    'http://localhost:3002/api/DD924/data',
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
  dataKeys: string[] = [
    'data',
    'data',
    'data',
    'data',
    'data',
    'data',
    'data',
  ]; // Ключи для данных из API
  yAxisTitle: string = 'Расход, тонн/ч';
  title: string = 'График расхода пара';
  yAxisRange: { min: number; max: number } = { min: 0, max: 5 }; // Диапазон значений оси Y
  timeRange: number = 10; // Временной диапазон по умолчанию (10 минут)
}
