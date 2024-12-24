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

  data1: TemperatureData[] = [];
  data2: TemperatureData[] = [];
  startTime1: Date = new Date(Date.now() - 30 * 60 * 1000);
  endTime1: Date = new Date();

  startTime2: Date = new Date(Date.now() - 30 * 60 * 1000);
  endTime2: Date = new Date();

  constructor(private sushilkaGraphService: SushilkaGraphService) {}

  ngOnInit(): void {
    this.fetchData();

    this.intervalId = setInterval(() => {
      this.endTime1 = new Date();
      this.startTime1 = new Date(Date.now() - 30 * 60 * 1000);
      this.endTime2 = new Date();
      this.startTime2 = new Date(Date.now() - 30 * 60 * 1000);
      this.fetchData();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);

    if (this.chart1) {
      this.chart1.destroy();
    }

    if (this.chart2) {
      this.chart2.destroy();
    }
  }

  async fetchData() {
    try {
      this.data1 = await this.sushilkaGraphService.getTemperatureData(this.startTime1, this.endTime1, 'sushilka1');
      this.renderChart1();
    } catch (err) {
      console.error('Error fetching data for sushilka1:', err);
    }

    try {
      this.data2 = await this.sushilkaGraphService.getTemperatureData(this.startTime2, this.endTime2, 'sushilka2');
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
    this.chart1 = this.sushilkaGraphService.renderChart(ctx!, this.data1, 'sushilka1');
  }

  renderChart2() {
    const ctx = this.chartCanvas2.nativeElement.getContext('2d');
    if (this.chart2) {
      this.chart2.destroy();
    }
    this.chart2 = this.sushilkaGraphService.renderChart(ctx!, this.data2, 'sushilka2');
  }

  handleTimeChange(chartNumber: number, direction: 'backward' | 'forward') {
    const hourChange = 60 * 60 * 1000; // 1 hour in milliseconds
    const timeChange = direction === 'backward' ? -hourChange : hourChange;

    if (chartNumber === 1) {
      this.startTime1 = new Date(this.startTime1.getTime() + timeChange);
      this.endTime1 = new Date(this.endTime1.getTime() + timeChange);
    } else if (chartNumber === 2) {
      this.startTime2 = new Date(this.startTime2.getTime() + timeChange);
      this.endTime2 = new Date(this.endTime2.getTime() + timeChange);
    }

    this.fetchData();
  }
}
