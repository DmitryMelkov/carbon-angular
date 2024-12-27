import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { Chart, ChartTypeRegistry } from 'chart.js';
import 'chartjs-adapter-date-fns';
import CrosshairPlugin from 'chartjs-plugin-crosshair';
import { SushilkaVacuumService } from '../../../common/services/sushilki/sushilka-graph-vacuums.service';
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
  private chart!: Chart<keyof ChartTypeRegistry>;
  private intervalId?: any;
  private resetTimerId?: any;

  private currentTime: Date = new Date();
  private autoUpdateInterval: number = 5000; // 5 секунд
  private timeOffset: number = 0;
  linesVisible: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private vacuumService: SushilkaVacuumService
  ) {}

  async ngOnInit() {
    this.sushilkaId =
      this.sushilkaId || this.route.snapshot.paramMap.get('id') || '';
    await this.loadData();
    this.startAutoUpdate();
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
    this.currentTime = new Date();
    const endTime = new Date(this.currentTime.getTime() + this.timeOffset);
    const startTime = new Date(endTime.getTime() - 30 * 60 * 1000);

    try {
      const sushilkaData = await this.vacuumService.getVacuumData(
        startTime,
        endTime,
        this.sushilkaId
      );
      const { labels, values1, values2, values3 } =
        this.vacuumService.processVacuumData(sushilkaData);
      this.updateChart(labels, values1, values2, values3);
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
      const chartOptions = this.vacuumService.getChartOptions();
      const ctx = this.canvasRef.nativeElement.getContext('2d');
      this.chart = this.vacuumService.createChart(
        ctx!,
        labels,
        values1,
        values2,
        values3,
        chartOptions,
        this.sushilkaId
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
