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

Chart.register(CrosshairPlugin);

@Component({
  selector: 'app-sushilka-graph-temper',
  imports: [ControlButtonComponent],
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

  constructor(
    private route: ActivatedRoute,
    private dataService: SushilkaDataService // Используем новый сервис
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
            this.dataService.processTemperatureData(sushilkaData as TemperatureData[]);
          this.updateChart(labels, values1, values2, values3);
        } else {
          console.warn('Получены данные не температурного типа');
        }
      } else {
        console.warn('Нет данных для отображения');
      }
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }


  private updateChart(
    labels: Date[],
    values1: (number | null)[],
    values2: (number | null)[],
    values3: (number | null)[]
  ) {
    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values1;
      this.chart.data.datasets[1].data = values2;
      this.chart.data.datasets[2].data = values3;
      this.chart.update();
    } else {
      const chartOptions = this.dataService.getChartOptions('temperature'); // Указываем тип данных
      const ctx = this.canvasRef.nativeElement.getContext('2d');
      this.chart = this.dataService.createChart(
        ctx!,
        labels,
        values1,
        values2,
        values3,
        chartOptions,
        this.sushilkaId,
        'temperature' // Указываем тип данных
      );
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
