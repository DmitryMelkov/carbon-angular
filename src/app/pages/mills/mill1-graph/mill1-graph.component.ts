import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';

@Component({
  selector: 'app-mill1-graph',
  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './mill1-graph.component.html',
  styleUrl: './mill1-graph.component.scss',
})
export class Mill1GraphComponent {
  apiUrls: string[] = [`${environment.apiUrl}/api/mill1/data`];
  parameterNamesList: string[][] = [
    ['Фронтальное Мельница 1', 'Поперечное Мельница 1', 'Осевое Мельница 1'],
  ];
  customNames: string[][] = [['Фронтальное', 'Поперечное', 'Осевое']];
  dataKeys: string[] = ['data']; // Ключи для данных из API
  yAxisTitle: string = 'Вибрация, мм/с';
  title: string = 'График вибрации  мельница №1';
  yAxisRange: { min: number; max: number } = { min: 0, max: 30 };
  timeRange: number = 30;
}
