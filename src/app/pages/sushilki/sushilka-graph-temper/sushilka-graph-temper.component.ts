import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Chart, ChartTypeRegistry } from 'chart.js';
import 'chartjs-adapter-date-fns';
import CrosshairPlugin from 'chartjs-plugin-crosshair';
import { ActivatedRoute } from '@angular/router';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { SushilkaDataService } from '../../../common/services/sushilki/sushilka-graph.service';
import { TemperatureData } from '../../../common/types/sushilki-data-graph';
import { CommonModule } from '@angular/common';

Chart.register(CrosshairPlugin);

@Component({
  selector: 'app-sushilka-graph-temper',
  imports: [CommonModule, ControlButtonComponent],
  standalone: true,
  templateUrl: './sushilka-graph-temper.component.html',
  styleUrls: ['./sushilka-graph-temper.component.scss'],
})
export class SushilkaGraphTemperComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() sushilkaId!: string;
  @Input() timeRange: number = 30; // Добавляем входное свойство
  private chart!: Chart<keyof ChartTypeRegistry>;
  private intervalId?: any;
  private resetTimerId?: any;
  private currentTime: Date = new Date();
  private autoUpdateInterval: number = 5000; // 5 секунд
  private timeOffset: number = 0;
  linesVisible: boolean = true;
  noDataMessage: string | null = null; // Переменная для сообщения

  constructor(
    private route: ActivatedRoute,
    private dataService: SushilkaDataService
  ) {}

  async ngOnInit() {
    this.sushilkaId =
      this.sushilkaId || this.route.snapshot.paramMap.get('id') || '';
    await this.loadData();
    this.startAutoUpdate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timeRange']) {
      this.loadData(); // Вызываем loadData при изменении timeRange
    }
  }

  private startAutoUpdate() {
    this.intervalId = setInterval(() => {
      this.loadData();
    }, this.autoUpdateInterval);
  }

  private resetToCurrentTimeAfterDelay() {
    this.clearResetTimer();
    this.resetTimerId = setTimeout(() => this.resetToCurrentTime(), 10000);
  }

  private clearResetTimer() {
    if (this.resetTimerId) {
      clearTimeout(this.resetTimerId);
      this.resetTimerId = undefined;
    }
  }

  private async loadData() {
    try {
      this.currentTime = await this.dataService.getServerTime(); // Получаем время сервера
      const endTime = new Date(this.currentTime.getTime() + this.timeOffset);
      const startTime = new Date(
        endTime.getTime() - this.timeRange * 60 * 1000
      ); // Используем timeRange

      const sushilkaData = await this.dataService.getData(
        startTime,
        endTime,
        this.sushilkaId,
        'temperature' // Указываем тип данных
      );

      // Здесь мы проверяем, какой тип данных мы получили
      if (Array.isArray(sushilkaData) && sushilkaData.length > 0) {
        const firstDataPoint = sushilkaData[0];

        // Проверяем, является ли первый элемент типа TemperatureData
        if ('temperatures' in firstDataPoint) {
          const { labels, values1, values2, values3 } =
            this.dataService.processTemperatureData(
              sushilkaData as TemperatureData[]
            );

          // Проверяем, есть ли данные для отображения
          const hasData =
            values1.some((v) => v !== null) ||
            values2.some((v) => v !== null) ||
            values3.some((v) => v !== null);

          if (hasData) {
            this.noDataMessage = null; // Скрываем сообщение
            this.updateChart(labels, values1, values2, values3);
          } else {
            this.noDataMessage = 'Нет данных для отображения';
            this.destroyChart(); // Уничтожаем график, если он был создан
          }
        } else {
          this.noDataMessage = 'Получены данные не температурного типа';
          this.destroyChart();
        }
      } else {
        this.noDataMessage = 'Нет данных для отображения';
        this.destroyChart();
      }
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      this.noDataMessage = 'Ошибка при загрузке данных';
      this.destroyChart();
    }
  }

  private updateChart(
    labels: Date[],
    values1: (number | null)[],
    values2: (number | null)[],
    values3: (number | null)[]
  ) {
    if (!this.chart) {
      const chartOptions = this.dataService.getChartOptions('temperature');
      const ctx = this.canvasRef.nativeElement.getContext('2d');
      if (ctx) {
        this.chart = this.dataService.createChart(
          ctx,
          labels,
          values1,
          values2,
          values3,
          chartOptions,
          this.sushilkaId,
          'temperature'
        );
      }
    } else {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values1;
      this.chart.data.datasets[1].data = values2;
      this.chart.data.datasets[2].data = values3;
      this.chart.update();
    }
  }

  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null!;
    }
  }

  goBack() {
    this.timeOffset -= 15 * 60 * 1000;
    this.loadData();
    this.resetToCurrentTimeAfterDelay();
  }

  goForward() {
    this.timeOffset += 15 * 60 * 1000;
    this.loadData();
    this.resetToCurrentTimeAfterDelay();
  }

  resetToCurrentTime() {
    this.timeOffset = 0;
    this.loadData();
  }

  toggleLinesVisibility() {
    this.linesVisible = !this.linesVisible;
    if (this.chart) {
      this.chart.data.datasets.forEach((dataset) => {
        dataset.hidden = !this.linesVisible;
      });
      this.chart.update();
    }
  }

  ngOnDestroy() {
    this.clearResetTimer();
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
