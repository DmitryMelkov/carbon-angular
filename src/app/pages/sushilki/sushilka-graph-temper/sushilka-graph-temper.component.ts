import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';
import { environment } from '../../../../environments/environment'; // Импортируем environment

@Component({
  selector: 'app-sushilka-graph-temper',
  standalone: true,
  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './sushilka-graph-temper.component.html',
  styleUrls: ['./sushilka-graph-temper.component.scss'],
})
export class SushilkaGraphTemperComponent implements OnInit {
  @Input() sushilkaId!: string;
  @Input() timeRange: number = 30;

  sushilkaNumber: string = ''; // Номер сушилки

  // Массивы для универсального компонента
  apiUrls: string[] = [];
  parameterNamesList: string[][] = [];
  dataKeys: string[] = [];

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    // Если sushilkaId не передан через @Input, берем его из маршрута
    this.sushilkaId =
      this.sushilkaId || this.route.snapshot.paramMap.get('id') || '';

    // Извлекаем номер сушилки
    this.sushilkaNumber = this.sushilkaId.replace('sushilka', '');

    // Формируем массивы для универсального компонента
    this.apiUrls = [
      `${environment.apiUrl}/api/sushilka${this.sushilkaId}/data`,
    ];

    this.parameterNamesList = [
      [
        'Температура в топке',
        'Температура в камере смешения',
        'Температура уходящих газов',
      ], // Параметры для первого API
    ];

    this.dataKeys = ['temperatures']; // Ключи для данных из API
  }
}
