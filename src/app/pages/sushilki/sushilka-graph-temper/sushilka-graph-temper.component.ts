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
import { Subscription } from 'rxjs';

Chart.register(CrosshairPlugin);

@Component({
  selector: 'app-sushilka-graph-temper',
  templateUrl: './sushilka-graph-temper.component.html',
  styleUrls: ['./sushilka-graph-temper.component.scss'],
})
export class SushilkaGraphTemperComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;
  private intervalId: any;
  private dataSubscription!: Subscription;

  data: TemperatureData[] = [];
  startTime: Date = new Date(Date.now() - 30 * 60 * 1000);
  endTime: Date = new Date();

  constructor(private sushilkaGraphService: SushilkaGraphService) {}

  ngOnInit(): void {
    this.fetchData();
    this.intervalId = setInterval(() => {
      this.endTime = new Date();
      this.startTime = new Date(Date.now() - 30 * 60 * 1000);
      this.fetchData();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchData() {
    this.dataSubscription = this.sushilkaGraphService
      .getTemperatureData(this.startTime, this.endTime)
      .subscribe({
        next: (data) => {
          this.data = data;
          this.renderChart();
        },
        error: (err) => {
          console.error('Ошибка при запросе данных:', err);
        },
      });
  }

  renderChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = this.sushilkaGraphService.renderChart(ctx!, this.data);
  }

  handleBackward() {
    this.startTime = new Date(this.startTime.getTime() - 60 * 60 * 1000);
    this.endTime = new Date(this.endTime.getTime() - 60 * 60 * 1000);
    this.fetchData();
  }

  handleForward() {
    this.startTime = new Date(this.startTime.getTime() + 60 * 60 * 1000);
    this.endTime = new Date(this.endTime.getTime() + 60 * 60 * 1000);
    this.fetchData();
  }
}
