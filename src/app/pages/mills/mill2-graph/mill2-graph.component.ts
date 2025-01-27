import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';

@Component({
  selector: 'app-mill2-graph',
  standalone: true,

  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './mill2-graph.component.html',
  styleUrl: './mill2-graph.component.scss',
})
export class Mill2GraphComponent {
  apiUrls: string[] = [`${environment.apiUrl}/api/mill2/data`];
  parameterNamesList: string[][] = [
    ['Фронтальное Мельница 2', 'Поперечное Мельница 2', 'Осевое Мельница 2'],
  ];
  customNames: string[][] = [['Фронтальное', 'Поперечное', 'Осевое']];
  dataKeys: string[] = ['data']; // Ключи для данных из API
  yAxisTitle: string = 'Вибрация, мм/с';
  title: string = 'График вибрации мельница №2';
  yAxisRange: { min: number; max: number } = { min: 0, max: 30 };
  timeRange: number = 30;

  // Настройка зон
  zones = [
    { min: 0, max: 20, color: 'rgba(0, 255, 0, 0.1)' }, // Зеленая зона
    { min: 20, max: 25, color: 'rgba(255, 255, 0, 0.1)' }, // Желтая зона
    { min: 25, max: 30, color: 'rgba(255, 0, 0, 0.1)' }, // Красная зона
  ];
}
