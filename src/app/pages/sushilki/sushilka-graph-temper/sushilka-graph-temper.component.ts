import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import CrosshairPlugin from 'chartjs-plugin-crosshair';
import { TemperatureData } from '../../../common/types/sushilki-data-graph';
import { SushilkaGraphService } from '../../../common/services/sushilka-graph.service';

Chart.register(CrosshairPlugin);

@Component({
  selector: 'app-sushilka-graph-temper',
  templateUrl: './sushilka-graph-temper.component.html',
  styleUrls: ['./sushilka-graph-temper.component.scss'],
})
export class SushilkaGraphTemperComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas1', { static: true })
  chartCanvas1!: ElementRef<HTMLCanvasElement>;

  @ViewChild('chartCanvas2', { static: true })
  chartCanvas2!: ElementRef<HTMLCanvasElement>;

  private chart1!: Chart;
  private chart2!: Chart;
  private intervalId: any;
  private timeChangeTimeout: any;

  data1: TemperatureData[] = [];
  data2: TemperatureData[] = [];
  startTime1: Date = new Date(Date.now() - 30 * 60 * 1000);
  endTime1: Date = new Date();

  startTime2: Date = new Date(Date.now() - 30 * 60 * 1000);
  endTime2: Date = new Date();

  constructor(private sushilkaGraphService: SushilkaGraphService) {}

  ngOnInit(): void {
    this.fetchData();
    this.updateCanvasSize();

    // Обновление данных каждую секунду
    this.intervalId = setInterval(() => {
      this.fetchData();
    }, 5000);

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => this.updateCanvasSize());
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    clearTimeout(this.timeChangeTimeout);

    if (this.chart1) {
      this.chart1.destroy();
    }

    if (this.chart2) {
      this.chart2.destroy();
    }

    // Удаление обработчика события изменения размера
    window.removeEventListener('resize', () => this.updateCanvasSize());
  }

  async fetchData() {
    try {
      this.data1 = await this.sushilkaGraphService.getTemperatureData(
        this.startTime1,
        this.endTime1,
        'sushilka1'
      );
      this.updateCanvasSize(); // Обновляем размеры перед отрисовкой
      this.renderChart1();
    } catch (err) {
      console.error('Error fetching data for sushilka1:', err);
    }

    try {
      this.data2 = await this.sushilkaGraphService.getTemperatureData(
        this.startTime2,
        this.endTime2,
        'sushilka2'
      );
      this.updateCanvasSize(); // Обновляем размеры перед отрисовкой
      this.renderChart2();
    } catch (err) {
      console.error('Error fetching data for sushilka2:', err);
    }
  }

  renderChart1() {
    const ctx = this.chartCanvas1.nativeElement.getContext('2d');
    if (this.chart1) {
      // Обновление данных графика
      this.chart1.data.labels = this.data1.map((t) => new Date(t.lastUpdated));
      this.chart1.data.datasets[0].data = this.data1.map(
        (t) => t.temperatures['Температура в топке']
      );
      this.chart1.data.datasets[1].data = this.data1.map(
        (t) => t.temperatures['Температура в камере смешения']
      );
      this.chart1.data.datasets[2].data = this.data1.map(
        (t) => t.temperatures['Температура уходящих газов']
      );

      // Обновляем график с анимацией
      this.chart1.update(); // Убираем 'none', чтобы анимация работала
    } else {
      this.chart1 = this.sushilkaGraphService.renderChart(
        ctx!,
        this.data1,
        'sushilka1'
      );

      // Обработчик клика для первого графика
      this.addClickHandler(this.chart1);
    }
  }

  renderChart2() {
    const ctx = this.chartCanvas2.nativeElement.getContext('2d');
    if (this.chart2) {
      // Обновление данных графика
      this.chart2.data.labels = this.data2.map((t) => new Date(t.lastUpdated));
      this.chart2.data.datasets[0].data = this.data2.map(
        (t) => t.temperatures['Температура в топке']
      );
      this.chart2.data.datasets[1].data = this.data2.map(
        (t) => t.temperatures['Температура в камере смешения']
      );
      this.chart2.data.datasets[2].data = this.data2.map(
        (t) => t.temperatures['Температура уходящих газов']
      );

      // Обновляем график с анимацией
      this.chart2.update(); // Убираем 'none', чтобы анимация работала
    } else {
      this.chart2 = this.sushilkaGraphService.renderChart(
        ctx!,
        this.data2,
        'sushilka2'
      );

      // Обработчик клика для второго графика
      this.addClickHandler(this.chart2);
    }
  }

  // Метод для добавления обработчика кликов
  private addClickHandler(chart: Chart) {
    const ctx = chart.ctx.canvas;
    ctx.addEventListener('click', (event) => {
      const activePoints = chart.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        false
      );

      console.log('Координаты клика:', event.offsetX, event.offsetY); // Вывод координат клика

      if (activePoints.length > 0) {
        const { datasetIndex, index } = activePoints[0];
        const label = chart.data.datasets[datasetIndex].label;
        const value = chart.data.datasets[datasetIndex].data[index];

        if (chart.data.labels && index < chart.data.labels.length) {
          const timestamp = chart.data.labels[index] as Date; // Явно указываем тип
          console.log(
            `Нажата метка: ${label}, Значение: ${value}°C, Дата: ${new Date(
              timestamp
            ).toLocaleString()}`
          );
        } else {
          console.log('Ошибка: метка времени не найдена.');
        }
      } else {
        console.log('Нажата область вне меток.');
      }
    });
  }

  handleTimeChange(chartNumber: number, direction: 'backward' | 'forward') {
    const result = this.sushilkaGraphService.changeTime(
      chartNumber,
      direction,
      this.startTime1,
      this.endTime1,
      this.startTime2,
      this.endTime2
    );

    this.startTime1 = result.startTime1;
    this.endTime1 = result.endTime1;
    this.startTime2 = result.startTime2;
    this.endTime2 = result.endTime2;

    clearTimeout(this.timeChangeTimeout);
    this.timeChangeTimeout = setTimeout(() => {
      this.resetToCurrentValues();
    }, 10000);

    // Используем requestAnimationFrame для обновления графиков
    requestAnimationFrame(() => {
      this.fetchData(); // Обновляем данные графиков
    });
  }

  resetToCurrentValues() {
    const { startTime: newStartTime1, endTime: newEndTime1 } =
      this.sushilkaGraphService.resetToCurrentValues();
    const { startTime: newStartTime2, endTime: newEndTime2 } =
      this.sushilkaGraphService.resetToCurrentValues();

    this.startTime1 = newStartTime1;
    this.endTime1 = newEndTime1;
    this.startTime2 = newStartTime2;
    this.endTime2 = newEndTime2;

    this.fetchData();
  }

  updateCanvasSize() {
    const canvas1 = this.chartCanvas1.nativeElement;
    const canvas2 = this.chartCanvas2.nativeElement;

    // Обновление размеров канвасов через сервис
    this.sushilkaGraphService.updateCanvasSize(canvas1);
    this.sushilkaGraphService.updateCanvasSize(canvas2);

    // Перерисовка графиков после изменения размера
    if (this.chart1) {
      this.renderChart1();
    }
    if (this.chart2) {
      this.renderChart2();
    }
  }
}
