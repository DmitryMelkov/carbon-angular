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


Chart.register(CrosshairPlugin);

@Component({
  selector: 'app-sushilka-graph-vacuums',
  templateUrl: './sushilka-graph-vacuums.component.html',
  styleUrls: ['./sushilka-graph-vacuums.component.scss'],
})
export class SushilkaGraphVacuumsComponent implements OnInit, OnDestroy {
  @ViewChild('canvas1') canvasRef1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2') canvasRef2!: ElementRef<HTMLCanvasElement>;
  private chart1!: Chart;
  private chart2!: Chart;

  constructor(private vacuumService: SushilkaVacuumService) {}

  async ngOnInit() {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 30 * 60 * 1000); // последние полчаса

    try {
      // Получаем данные для обеих сушилок
      const sushilka1Data = await this.vacuumService.getVacuumData(
        startTime,
        endTime,
        'sushilka1'
      );
      const sushilka2Data = await this.vacuumService.getVacuumData(
        startTime,
        endTime,
        'sushilka2'
      );

      // Подготовим данные для графиков
      const labels = sushilka1Data.map((data) => new Date(data.lastUpdated));
      const sushilka1Values1 = sushilka1Data.map((data) =>
        parseFloat(data.vacuums['Разрежение в топке'])
      );
      const sushilka1Values2 = sushilka1Data.map((data) =>
        parseFloat(data.vacuums['Разрежение в камере выгрузки'])
      );
      const sushilka1Values3 = sushilka1Data.map((data) =>
        parseFloat(data.vacuums['Разрежение воздуха на разбавление'])
      );

      const sushilka2Values1 = sushilka2Data.map((data) =>
        parseFloat(data.vacuums['Разрежение в топке'])
      );
      const sushilka2Values2 = sushilka2Data.map((data) =>
        parseFloat(data.vacuums['Разрежение в камере выгрузки'])
      );
      const sushilka2Values3 = sushilka2Data.map((data) =>
        parseFloat(data.vacuums['Разрежение воздуха на разбавление'])
      );

      const chartOptions = this.vacuumService.getChartOptions();

      this.createChart1(
        labels,
        sushilka1Values1,
        sushilka1Values2,
        sushilka1Values3,
        chartOptions
      );
      this.createChart2(
        labels,
        sushilka2Values1,
        sushilka2Values2,
        sushilka2Values3,
        chartOptions
      );
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }

  createChart1(
    labels: Date[],
    values1: number[],
    values2: number[],
    values3: number[],
    options: ChartOptions
  ) {
    const ctx = this.canvasRef1.nativeElement.getContext('2d');
    if (this.chart1) {
      this.chart1.destroy(); // Уничтожаем предыдущий график, если он существует
    }

    this.chart1 = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Разрежение в топке',
            data: values1,
            borderColor: 'blue',
            fill: false,
          },
          {
            label: 'Разрежение в камере выгрузки',
            data: values2,
            borderColor: 'green',
            fill: false,
          },
          {
            label: 'Разрежение воздуха на разбавление',
            data: values3,
            borderColor: 'orange',
            fill: false,
          },
        ],
      },
      options: options,
    });
  }

  createChart2(
    labels: Date[],
    values1: number[],
    values2: number[],
    values3: number[],
    options: ChartOptions
  ) {
    const ctx = this.canvasRef2.nativeElement.getContext('2d');
    if (this.chart2) {
      this.chart2.destroy(); // Уничтожаем предыдущий график, если он существует
    }

    this.chart2 = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Разрежение в топке (Сушилка 2)',
            data: values1,
            borderColor: 'red',
            fill: false,
          },
          {
            label: 'Разрежение в камере выгрузки (Сушилка 2)',
            data: values2,
            borderColor: 'purple',
            fill: false,
          },
          {
            label: 'Разрежение воздуха на разбавление (Сушилка 2)',
            data: values3,
            borderColor: 'cyan',
            fill: false,
          },
        ],
      },
      options: options,
    });
  }

  ngOnDestroy() {
    if (this.chart1) {
      this.chart1.destroy(); // Уничтожаем график при уничтожении компонента
    }
    if (this.chart2) {
      this.chart2.destroy(); // Уничтожаем график при уничтожении компонента
    }
  }
}
