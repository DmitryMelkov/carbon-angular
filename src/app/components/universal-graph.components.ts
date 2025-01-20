import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { Chart, ChartOptions, ChartTypeRegistry } from 'chart.js';
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
            id="{{ sushilkaId }}-canvas"
          ></canvas>
          <div *ngIf="noDataMessage" class="dynamic-graph__graph-no-data">
            {{ noDataMessage }}
          </div>
        </div>
        <div class="dynamic-graph__btns">
          <app-control-button (click)="goBack()"> Назад </app-control-button>
          <app-control-button (click)="goForward()">
            Вперёд
          </app-control-button>
          <app-control-button (click)="resetToCurrentTime()">
            Вернуться к текущим значениям
          </app-control-button>
          <app-control-button (click)="toggleLinesVisibility()">
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
export class UniversalGraphComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  // Входные параметры
  @Input() apiUrl!: string; // URL API
  @Input() parameterNames!: string[]; // Названия параметров
  @Input() dataKey!: string; // Ключ данных (например, 'temperatures' или 'vacuums')
  @Input() yAxisTitle!: string; // Название оси Y
  @Input() colors!: string[]; // Цвета линий
  @Input() title!: string; // Заголовок графика
  @Input() yAxisRange!: { min: number; max: number }; // Диапазон оси Y
  @Input() sushilkaId!: string; // Идентификатор сушилки
  @Input() timeRange: number = 30; // Временной диапазон в минутах

  private chart!: Chart<keyof ChartTypeRegistry>;
  private intervalId?: any;
  private resetTimerId?: any;
  private currentTime: Date = new Date();
  private autoUpdateInterval: number = 5000; // 5 секунд
  private timeOffset: number = 0; // Смещение времени
  linesVisible: boolean = true; // Видимость линий
  noDataMessage: string | null = null; // Сообщение об отсутствии данных

  constructor(private graphService: UniversalGraphService) {}

  async ngOnInit() {
    await this.loadData();
    this.startAutoUpdate();
  }

  ngOnDestroy() {
    this.clearResetTimer();
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.chart) this.chart.destroy();
  }

  //Загружает данные и обновляет график.

  private async loadData() {
    try {
      // Обновляем текущее время
      this.currentTime = new Date();

      // Вычисляем временной диапазон
      const endTime = new Date(this.currentTime.getTime() + this.timeOffset);
      const startTime = new Date(
        endTime.getTime() - this.timeRange * 60 * 1000
      );

      // Загружаем данные
      const data = await this.graphService.getData(
        this.apiUrl,
        startTime,
        endTime
      );
      const { labels, values } = this.graphService.processData(
        data,
        this.parameterNames,
        this.dataKey
      );

      if (values.some((dataset) => dataset.some((v) => v !== null))) {
        this.noDataMessage = null;

        // Проверяем, выходят ли новые данные за пределы текущего диапазона
        const lastLabel = labels[labels.length - 1];
        if (lastLabel && lastLabel.getTime() > endTime.getTime()) {
          // Смещаем график вперед
          this.timeOffset += lastLabel.getTime() - endTime.getTime();
        }

        this.updateChart(labels, values);
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

  private getChartOptions(): ChartOptions {
    return {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute',
            tooltipFormat: 'HH:mm',
            displayFormats: {
              minute: 'HH:mm',
            },
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: this.yAxisTitle,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: this.title,
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem) => {
              const label = tooltipItem.dataset.label || '';
              const value = tooltipItem.raw;
              return `${label}: ${value}`;
            },
          },
        },
        legend: {
          position: 'right',
          labels: {
            generateLabels: (chart) => {
              const originalLabels =
                Chart.defaults.plugins.legend.labels.generateLabels(chart);
              return originalLabels.map((label) => {
                const datasetIndex = label.datasetIndex;

                if (
                  datasetIndex !== undefined &&
                  chart.data.datasets[datasetIndex]
                ) {
                  const datasetData = chart.data.datasets[datasetIndex].data;
                  const lastValue = datasetData[datasetData.length - 1];

                  // Формируем текст в нужном порядке: значение / наименование
                  const name = label.text; // Наименование параметра

                  if (lastValue !== null) {
                    label.text = `${lastValue} ${
                      this.yAxisTitle.includes('градусы') ? '°C' : 'кгс/см2'
                    } | ${name}`;
                  } else {
                    label.text = `(нет данных) | ${name}`;
                  }
                }
                return label;
              });
            },
          },
          onClick: (event: any, legendItem) => {
            this.handleLegendClick(event, legendItem, this.chart);
          },
        },
      },
      elements: {
        point: {
          radius: 0, // Убираем точки
        },
        line: {
          borderWidth: 2, // Толщина линии
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  private handleLegendClick(
    event: any,
    legendItem: any,
    chart: Chart<keyof ChartTypeRegistry>
  ) {
    if (event.native) {
      event.native.stopPropagation();
    }

    const datasetIndex = legendItem.datasetIndex;
    if (datasetIndex !== undefined) {
      const dataset = chart.data.datasets[datasetIndex];
      dataset.hidden = !dataset.hidden;
      chart.update();
    }
  }

  private updateChart(labels: Date[], values: (number | null)[][]) {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (!this.chart) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: this.parameterNames.map((name, index) => ({
            label: name,
            data: values[index],
            borderColor: this.colors[index],
            fill: false,
            pointRadius: 1, // Убираем точки
            borderWidth: 2, // Толщина линии
            backgroundColor: 'transparent',
            spanGaps: false, // Разрывы
          })),
        },
        options: this.getChartOptions(),
      });
    } else {
      this.chart.data.labels = labels;
      this.parameterNames.forEach((_, index) => {
        this.chart.data.datasets[index].data = values[index];
      });
      this.chart.update();
    }
  }

  //Запускает автоматическое обновление данных.
  private startAutoUpdate() {
    this.intervalId = setInterval(() => {
      this.loadData();
    }, this.autoUpdateInterval); // Обновление каждые 5 секунд
  }

  goBack() {
    this.timeOffset -= 15 * 60 * 1000; // Смещаем на 15 минут назад
    this.loadData();
    this.resetToCurrentTimeAfterDelay(); // Сброс к текущему времени через 10 секунд
  }

  goForward() {
    this.timeOffset += 15 * 60 * 1000; // Смещаем на 15 минут вперед
    this.loadData();
    this.resetToCurrentTimeAfterDelay(); // Сброс к текущему времени через 10 секунд
  }

  //Сбрасывает график к текущему времени.
  resetToCurrentTime() {
    this.timeOffset = 0;
    this.loadData();
  }

  //Переключает видимость всех линий на графике.
  toggleLinesVisibility() {
    this.linesVisible = !this.linesVisible;
    if (this.chart) {
      this.chart.data.datasets.forEach((dataset) => {
        dataset.hidden = !this.linesVisible;
      });
      this.chart.update();
    }
  }

  //Устанавливает таймер для сброса к текущему времени.
  private resetToCurrentTimeAfterDelay() {
    this.clearResetTimer();
    this.resetTimerId = setTimeout(() => this.resetToCurrentTime(), 10000); // Сброс через 10 секунд
  }

  //Очищает таймер сброса.
  private clearResetTimer() {
    if (this.resetTimerId) {
      clearTimeout(this.resetTimerId);
      this.resetTimerId = undefined;
    }
  }

  //Уничтожает график.
  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null!;
    }
  }
}
