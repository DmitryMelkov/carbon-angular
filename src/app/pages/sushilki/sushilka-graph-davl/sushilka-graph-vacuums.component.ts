// src/app/components/sushilka-graph-vacuums/sushilka-graph-vacuums.component.ts

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
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
  private chart!: Chart;

  // Переменные для отслеживания времени
  private currentTime: Date = new Date();
  private timeInterval: number = 15 * 60 * 1000; // 15 минут в миллисекундах
  private sushilkaId!: string; // Используем оператор '!', чтобы указать, что значение будет установлено позже

  constructor(
    private vacuumService: SushilkaVacuumService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.sushilkaId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.sushilkaId);

    await this.loadData();
  }

  // Метод для загрузки данных
  private async loadData() {
    const endTime = this.currentTime;
    const startTime = new Date(endTime.getTime() - 30 * 60 * 1000); // последние полчаса

    try {
      // Получаем данные для сушилки с указанным ID
      const sushilkaData = await this.vacuumService.getVacuumData(
        startTime,
        endTime,
        this.sushilkaId
      );

      // Подготовим данные для графика
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

      const chartOptions = this.vacuumService.getChartOptions();

      this.createChart(labels, values1, values2, values3, chartOptions);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }

  // Метод для перемещения назад на 15 минут
  goBack() {
    this.currentTime = new Date(this.currentTime.getTime() - this.timeInterval);
    this.loadData();
  }

  // Метод для перемещения вперед на 15 минут
  goForward() {
    this.currentTime = new Date(this.currentTime.getTime() + this.timeInterval);
    this.loadData();
  }

  createChart(
    labels: Date[],
    values1: number[],
    values2: number[],
    values3: number[],
    options: ChartOptions
  ) {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (this.chart) {
      this.chart.destroy(); // Уничтожаем предыдущий график, если он существует
    }

    const colors = this.vacuumService.getChartDatasetColors(
      Number(this.sushilkaId.replace('sushilka', ''))
    ); // Преобразуем ID в число

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
            text: this.vacuumService.getChartTitle(this.sushilkaId), // Заголовок для графика
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
      this.chart.destroy(); // Уничтожаем график при уничтожении компонента
    }
  }
}
