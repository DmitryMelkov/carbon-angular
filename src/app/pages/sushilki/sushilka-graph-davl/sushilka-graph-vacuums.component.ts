import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import CrosshairPlugin from 'chartjs-plugin-crosshair';
import { SushilkaVacuumService } from '../../../common/services/sushilka-graph-vacuums.service';
import { ActivatedRoute } from '@angular/router';

Chart.register(CrosshairPlugin);

@Component({
  selector: 'app-sushilka-graph-vacuums',
  templateUrl: './sushilka-graph-vacuums.component.html',
  styleUrls: ['./sushilka-graph-vacuums.component.scss'],
})
export class SushilkaGraphVacuumsComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() sushilkaId!: string;
  private chart!: Chart;
  private intervalId!: any;

  private currentTime: Date = new Date();
  private autoUpdateInterval: number = 5 * 1000;

  private timeOffset: number = 0; // Смещение времени в миллисекундах
  linesVisible: boolean = true; // Состояние видимости линий

  constructor(private route: ActivatedRoute, private vacuumService: SushilkaVacuumService) {}

  async ngOnInit() {
    if (!this.sushilkaId) {
      this.sushilkaId = this.route.snapshot.paramMap.get('id') || '';
    }
    await this.loadData();
    this.startAutoUpdate();
  }

  private startAutoUpdate() {
    this.intervalId = setInterval(() => {
      this.loadData();
    }, this.autoUpdateInterval); // Обновляем данные каждые 5 секунд
  }

  private async loadData() {
    this.currentTime = new Date(); // Обновляем текущее время
    const endTime = new Date(this.currentTime.getTime() + this.timeOffset);
    const startTime = new Date(endTime.getTime() - 30 * 60 * 1000); // последние 30 минут

    try {
      const sushilkaData = await this.vacuumService.getVacuumData(
        startTime,
        endTime,
        this.sushilkaId
      );

      // Проверяем, получили ли мы данные
      if (!sushilkaData || sushilkaData.length === 0) {
        console.warn('Нет данных для отображения');
        return;
      }

      const labels = sushilkaData.map((data) => new Date(data.lastUpdated));
      const values1 = sushilkaData.map((data) =>
        parseFloat(data.vacuums['Разрежение в топке'])
      );
      const values2 = sushilkaData.map((data) =>
        parseFloat(data.vacuums['Разрежение в камере выгрузки'])
      );
      const values3 = sushilkaData.map((data) =>
        parseFloat(data.vacuums['Разрежение воздуха на разбавление'])
      );

      if (this.chart) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = values1;
        this.chart.data.datasets[1].data = values2;
        this.chart.data.datasets[2].data = values3;

        this.chart.update();
      } else {
        const chartOptions = this.vacuumService.getChartOptions();
        this.createChart(labels, values1, values2, values3, chartOptions);
      }
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }

  // Методы для управления графиком
  goBack() {
    this.timeOffset -= 15 * 60 * 1000; // Уменьшаем смещение на 15 минут
    this.loadData();
  }

  goForward() {
    this.timeOffset += 15 * 60 * 1000; // Увеличиваем смещение на 15 минут
    this.loadData();
  }

  resetToCurrentTime() {
    this.timeOffset = 0;
    this.loadData();
  }

  toggleLinesVisibility() {
    this.linesVisible = !this.linesVisible; // Переключаем состояние
    if (this.chart) {
      // Обновляем данные графика в зависимости от состояния
      this.chart.data.datasets.forEach((dataset) => {
        dataset.hidden = !this.linesVisible; // Скрываем или показываем линии
      });
      this.chart.update(); // Обновляем график
    }
  }

  createChart(
    labels: Date[],
    values1: number[],
    values2: number[],
    values3: number[],
    options: ChartOptions
  ) {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Не удалось получить контекст канваса');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const colors = this.vacuumService.getChartDatasetColors(
      Number(this.sushilkaId.replace('sushilka', ''))
    );

    this.chart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Разрежение в топке',
            data: values1,
            borderColor: colors[0],
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
            backgroundColor: 'transparent',
          },
          {
            label: 'Разрежение в камере выгрузки',
            data: values2,
            borderColor: colors[1],
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
            backgroundColor: 'transparent',
          },
          {
            label: 'Разрежение воздуха на разбавление',
            data: values3,
            borderColor: colors[2],
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
            backgroundColor: 'transparent',
          },
        ],
      },
      options: {
        ...options,
        plugins: {
          ...options.plugins,
          title: {
            display: true,
            text: this.vacuumService.getChartTitle(this.sushilkaId),
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
