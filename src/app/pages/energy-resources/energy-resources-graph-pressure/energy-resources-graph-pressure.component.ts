import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { EnergyResourcesGraphService } from '../../../common/services/energy-resources/energy-resources-graph.service';

@Component({
  selector: 'app-energy-resources-graph-pressure',
  templateUrl: './energy-resources-graph-pressure.component.html',
  styleUrls: ['./energy-resources-graph-pressure.component.scss'],
})
export class EnergyResourcesGraphPressureComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;
  private intervalId: any;
  private timeRange: number = 30; // Временной диапазон в минутах

  constructor(private energyService: EnergyResourcesGraphService) {}

  ngOnInit() {
    this.loadData();
    this.intervalId = setInterval(() => this.loadData(), 5000); // Автообновление каждые 5 секунд
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private loadData() {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - this.timeRange * 60 * 1000);

    this.energyService.getPressureData(startTime, endTime).subscribe({
      next: (data) => {
        console.log('Данные из API:', data); // Логирование данных из API
        const { labels, values } = this.energyService.processPressureData(data);
        this.updateChart(labels, values);
      },
      error: (error) => {
        console.error('Ошибка при загрузке данных:', error);
      },
    });
  }

  private updateChart(labels: Date[], values: (number | null)[]) {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (!this.chart) {
      const options = this.energyService.getChartOptions();
      this.chart = this.energyService.createChart(ctx, labels, values, options);
    } else {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values;
      this.chart.update();
    }
  }
}
