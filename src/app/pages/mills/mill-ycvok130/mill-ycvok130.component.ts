import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';

@Component({
  selector: 'app-mill-ycvok130',
  standalone: true,
  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './mill-ycvok130.component.html',
  styleUrl: './mill-ycvok130.component.scss',
})
export class MillYCVOK130Component {
  apiUrls: string[] = [`${environment.apiUrl}/api/mill10b/data`];
  parameterNamesList: string[][] = [
    ['Фронтальное YCVOK130', 'Поперечное YCVOK130', 'Осевое YCVOK130'],
  ];
  customNames: string[][] = [['Фронтальное', 'Поперечное', 'Осевое']];
  dataKeys: string[] = ['data']; // Ключи для данных из API
  yAxisTitle: string = 'Вибрация, мм/с';
  title: string = 'График вибрации  YCVOK-130';
  yAxisRange: { min: number; max: number } = { min: 0, max: 30 };
  timeRange: number = 30;

  // Настройка зон

  zones = [
    { min: 0, max: 20, color: 'rgba(0, 255, 0, 0.1)', }, // Зеленая зона
    { min: 20, max: 25, color: 'rgba(255, 255, 0, 0.1)', }, // Желтая зона
    { min: 25, max: 30, color: 'rgba(255, 0, 0, 0.1)', }, // Красная зона
  ];
}
