import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';

@Component({
  selector: 'app-sushilka-graph-vacuums',
  standalone: true,
  imports: [CommonModule, UniversalGraphComponent],
  templateUrl: './sushilka-graph-vacuums.component.html',
  styleUrls: ['./sushilka-graph-vacuums.component.scss'],
})
export class SushilkaGraphVacuumsComponent implements OnInit, OnDestroy {
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
    this.apiUrls = [`http://localhost:3002/api/${this.sushilkaId}/data`];

    this.parameterNamesList = [
      [
        'Разрежение в топке',
        'Разрежение в камере выгрузки',
        'Разрежение воздуха на разбавление',
      ], // Параметры для первого API
    ];

    this.dataKeys = ['vacuums']; // Ключи для данных из API
  }

  ngOnDestroy() {
    // Логика очистки, если необходима
  }
}
