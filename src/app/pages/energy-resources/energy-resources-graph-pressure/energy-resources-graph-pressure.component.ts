import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';

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
    'http://localhost:3002/api/de093/data',
    'http://localhost:3002/api/dd972/data',
    'http://localhost:3002/api/dd973/data',
    'http://localhost:3002/api/dd576/data',
    'http://localhost:3002/api/dd569/data',
    'http://localhost:3002/api/dd923/data',
    'http://localhost:3002/api/DD924/data',
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
  dataKeys: string[] = [
    'data',
    'data',
    'data',
    'data',
    'data',
    'data',
    'data',
  ]; // Ключи для данных из API
  yAxisTitle: string = 'Давление, кгс/см²';
  title: string = 'График давления узлов учета';
  yAxisRange: { min: number; max: number } = { min: 0, max: 500 };
  timeRange: number = 30;
}
