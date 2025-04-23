import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart, ChartTypeRegistry } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { CommonModule } from '@angular/common';
import { ControlButtonComponent } from './control-button/control-button.component';
import { UniversalGraphService } from '../common/services/universal-graph.service';

@Component({
  selector: 'app-universal-graph',
  standalone: true,
  imports: [CommonModule, ControlButtonComponent],
  template: `
    <div class="dynamic-graph__container">
      <div id="chartContainer" class="dynamic-graph">
        <div class="dynamic-graph__content">
          <canvas
            class="dynamic-graph__graph"
            #canvas
            id="{{ graphId }}-canvas"
          ></canvas>
          <div *ngIf="noDataMessage" class="dynamic-graph__graph-no-data">
            {{ noDataMessage }}
          </div>
        </div>
        <div class="dynamic-graph__btns">
          <app-control-button (click)="goBack()" iconName="arrow_back "> Назад </app-control-button>
          <app-control-button (click)="goForward()" iconName="arrow_forward ">
            Вперёд
          </app-control-button>
          <app-control-button (click)="resetToCurrentTime()" iconName="refresh ">
            Вернуться к текущим значениям
          </app-control-button>
          <app-control-button (click)="toggleLinesVisibility()" iconName="visibility ">
            Скрыть/Показать все
          </app-control-button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @use '../../styles/mixins' as mixins;
      @use '../../styles/variables' as vars;

      .dynamic-graph {
        position: relative;
        width: 100%;
        &:not(:last-child) {
          margin-bottom: 30px;
        }
        &__content {
          position: relative;
          max-height: 400px;
        }
        &__graph {
          width: 100%;
          height: 400px;
          cursor: pointer;
        }
        &__btns {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }
        &__graph-no-data {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px;
          font-weight: bold;
          color: vars.$red;
          text-align: center;
          padding: 20px;
          background-color: rgba(vars.$red, 0.2);
          border: 2px solid vars.$red; // Толстая красная рамка
          border-radius: 8px;
          z-index: 10; // Чтобы сообщение было поверх графика
        }
      }
    `,
  ],
})
export class UniversalGraphComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() apiUrls!: string[];
  @Input() parameterNamesList!: string[][];
  @Input() customNames?: string[][];
  @Input() dataKeys!: string[];
  @Input() yAxisTitle!: string;
  @Input() title!: string;
  @Input() yAxisRange!: { min: number; max: number }; // Диапазон оси Y
  @Input() graphId!: string;
  @Input() timeRange: number = 10;
  @Input() animate: boolean = true;
  @Input() zones: { min: number; max: number; color: string }[] = [];
  @Input() units: string | string[] = ''; // Может быть строкой или массивом строк
  @Input() subKeys?: string[]; // Массив подключей для каждого набора параметров

  private chart!: Chart<keyof ChartTypeRegistry>;
  private intervalId?: any;
  private resetTimerId?: any;
  private currentTime: Date = new Date();
  private autoUpdateInterval: number = 5000;
  private timeOffset: number = 0;
  linesVisible: boolean = true;
  noDataMessage: string | null = null;

  constructor(private graphService: UniversalGraphService) {}

  async ngOnInit() {
    await this.loadData();
    this.startAutoUpdate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timeRange']) {
      this.loadData(); // Перезагружаем данные при изменении timeRange
    }
  }

  ngOnDestroy() {
    this.clearResetTimer();
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.chart) this.chart.destroy();
  }

  private async loadData() {
    try {
      this.currentTime = new Date();

      const endTime = new Date(this.currentTime.getTime() + this.timeOffset);
      const startTime = new Date(
        endTime.getTime() - this.timeRange * 60 * 1000
      );

      const dataPromises = this.apiUrls.map((apiUrl, index) =>
        this.graphService.getData(apiUrl, startTime, endTime)
      );

      const allData = await Promise.all(dataPromises);

      const allLabels: Date[] = [];
      const allValues: (number | null)[][] = [];

      allData.forEach((data, index) => {
        const { labels, values } = this.graphService.processData(
          data,
          this.parameterNamesList[index],
          this.dataKeys[index],
          this.subKeys ? this.subKeys[index] : undefined // Передаем subKey если он есть
        );

        allLabels.push(...labels);
        allValues.push(...values);
      });

      if (allValues.some((dataset) => dataset.some((v) => v !== null))) {
        this.noDataMessage = null;
        this.updateChart(allLabels, allValues);
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

  private updateChart(labels: Date[], values: (number | null)[][]) {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (!this.chart) {
      const chartOptions = this.graphService.getChartOptions(
        this.yAxisTitle,
        this.title,
        this.animate,
        this.units,
        this.zones,
        this.yAxisRange // Передаём диапазон оси Y
      );

      const datasets = this.graphService.createDatasets(
        this.parameterNamesList.flat(),
        values,
        this.customNames?.flat()
      );

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: chartOptions,
      });
    } else {
      this.chart.data.labels = labels;
      this.chart.data.datasets.forEach((dataset, index) => {
        dataset.data = values[index];
        if (this.customNames && this.customNames.flat()[index]) {
          dataset.label = this.customNames.flat()[index];
        }
      });
      this.chart.update();
    }
  }

  private startAutoUpdate() {
    this.intervalId = setInterval(() => {
      this.loadData();
    }, this.autoUpdateInterval);
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

  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null!;
    }
  }
}
