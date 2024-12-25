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

    // Обновление данных каждые 5 секунд
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
      this.renderChart2();
    } catch (err) {
      console.error('Error fetching data for sushilka2:', err);
    }
  }

  renderChart1() {
    const ctx = this.chartCanvas1.nativeElement.getContext('2d');
    if (this.chart1) {
      this.chart1.destroy();
    }
    this.chart1 = this.sushilkaGraphService.renderChart(
      ctx!,
      this.data1,
      'sushilka1'
    );
  }

  renderChart2() {
    const ctx = this.chartCanvas2.nativeElement.getContext('2d');
    if (this.chart2) {
      this.chart2.destroy();
    }
    this.chart2 = this.sushilkaGraphService.renderChart(
      ctx!,
      this.data2,
      'sushilka2'
    );
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

    this.fetchData();
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
