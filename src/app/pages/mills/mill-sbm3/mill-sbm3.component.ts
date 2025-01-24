import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';

@Component({
  selector: 'app-mill-sbm3',
  standalone: true,

  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './mill-sbm3.component.html',
  styleUrl: './mill-sbm3.component.scss'
})
export class MillSBM3Component {
  apiUrls: string[] = [`${environment.apiUrl}/api/mill10b/data`];
  parameterNamesList: string[][] = [
    ['Осевое ШБМ3', 'Вертикальное ШБМ3', 'Поперечное ШБМ3'],
  ];
  customNames: string[][] = [['Осевое', 'Вертикальное', 'Поперечное']];
  dataKeys: string[] = ['data']; // Ключи для данных из API
  yAxisTitle: string = 'Вибрация, мм/с';
  title: string = 'График вибрации  ШБМ №3';
  yAxisRange: { min: number; max: number } = { min: 0, max: 30 };
  timeRange: number = 30;
}
