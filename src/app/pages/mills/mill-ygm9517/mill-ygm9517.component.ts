import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mill-ygm9517',
  standalone: true,

  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './mill-ygm9517.component.html',
  styleUrl: './mill-ygm9517.component.scss'
})
export class MillYGM9517Component {
  apiUrls: string[] = [`${environment.apiUrl}/api/mill10b/data`];
  parameterNamesList: string[][] = [
    ['Фронтальное YGM9517', 'Осевое YGM9517', 'Поперечное YGM9517'],
  ];
  customNames: string[][] = [['Фронтальное', 'Осевое', 'Поперечное']];
  dataKeys: string[] = ['data']; // Ключи для данных из API
  yAxisTitle: string = 'Вибрация, мм/с';
  title: string = 'График вибрации YGM-9517';
  yAxisRange: { min: number; max: number } = { min: 0, max: 30 };
  timeRange: number = 30;
}
