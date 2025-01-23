import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';

@Component({
  selector: 'app-mill-ycvok130',
  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './mill-ycvok130.component.html',
  styleUrl: './mill-ycvok130.component.scss'
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
}
