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
  selector: 'app-sushilka-graph-temper',
  imports: [CommonModule, UniversalGraphComponent],
  standalone: true,
  templateUrl: './sushilka-graph-temper.component.html',
  styleUrls: ['./sushilka-graph-temper.component.scss'],
})
export class SushilkaGraphTemperComponent implements OnInit, OnDestroy {
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
