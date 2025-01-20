import {
  Component,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
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

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    // Если sushilkaId не передан через @Input, берем его из маршрута
    this.sushilkaId = this.sushilkaId || this.route.snapshot.paramMap.get('id') || '';

    // Извлекаем номер сушилки
    this.sushilkaNumber = this.sushilkaId.replace('sushilka', '');
  }

  ngOnDestroy() {
    // Логика очистки, если необходима
  }
}


