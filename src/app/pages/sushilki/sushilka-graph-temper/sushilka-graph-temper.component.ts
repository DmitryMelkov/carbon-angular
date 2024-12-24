import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SushilkiService } from '../../../common/services/sushilka.service';
import { SushilkiData } from '../../../common/types/sushilki-data';

Chart.register(...registerables);

@Component({
  selector: 'app-sushilka-graph',
  templateUrl: './sushilka-graph-temper.component.html',
  styleUrls: ['./sushilka-graph-temper.component.scss'],
})
export class SushilkaGraphTemperComponent implements AfterViewInit {
  @ViewChild('myChart1') myChart1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChart2') myChart2!: ElementRef<HTMLCanvasElement>;
  chart1!: Chart;
  chart2!: Chart;

  // Переменные для хранения данных о сушилках
  sushilkaData1!: SushilkiData;
  sushilkaData2!: SushilkiData;

  constructor(private sushilkiService: SushilkiService) {}

  // Измененный ngAfterViewInit
  ngAfterViewInit(): void {
    Promise.all([
      this.getSushilkaData('sushilka1'),
      this.getSushilkaData('sushilka2'),
    ]).then(() => {
      if (this.sushilkaData1) {
        this.createChart1();
      }
      if (this.sushilkaData2) {
        this.createChart2();
      }
    });
  }

  // Измененный метод getSushilkaData
  getSushilkaData(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.sushilkiService.getSushilkaData(id).subscribe((data) => {
        console.log('Полученные данные для', id, ':', data); // Проверка данных

        if (id === 'sushilka1') {
          this.sushilkaData1 = data;
          console.log('Данные для первой сушилки установлены'); // Логирование
        } else if (id === 'sushilka2') {
          this.sushilkaData2 = data;
          console.log('Данные для второй сушилки установлены'); // Логирование
        }

        resolve(); // Разрешаем промис после установки данных
      });
    });
  }

  createChart1() {
    if (this.chart1) {
      this.chart1.destroy(); // Уничтожаем старый график, если он существует
    }

    // Извлечение температур из первой сушилки
    const temperatures1 = this.sushilkaData1.temperatures;
    const tempData1_1 = temperatures1['Температура в топке'] || 0;
    const tempData1_2 = temperatures1['Температура в камере смешения'] || 0;
    const tempData1_3 = temperatures1['Температура уходящих газов'] || 0;

    // Создаем временные метки (например, для последних 30 минут)
    const now = new Date();
    const timeStamps = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (30 - i) * 60 * 1000);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }).reverse();

    // Создаем массивы данных для графика
    const tempDataArray1_1 = Array(30).fill(tempData1_1);
    const tempDataArray1_2 = Array(30).fill(tempData1_2);
    const tempDataArray1_3 = Array(30).fill(tempData1_3);

    // Создаем график
    this.chart1 = new Chart(this.myChart1.nativeElement, {
      type: 'line',
      data: {
        labels: timeStamps,
        datasets: [
          {
            label: 'Температура в топке',
            data: tempDataArray1_1,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 0,
          },
          {
            label: 'Температура в камере смешения',
            data: tempDataArray1_2,
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(255, 99, 132)',
            tension: 0.1,
            pointRadius: 0,
          },
          {
            label: 'Температура уходящих газов',
            data: tempDataArray1_3,
            fill: false,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgb(54, 162, 235)',
            tension: 0.1,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'График Сушилки №1', // Заголовок для первого графика
            color: 'green', // Цвет заголовка
            font: {
              size: 20, // Размер шрифта заголовка
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Время (минуты)',
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Температура (°C)',
            },
            beginAtZero: true,
            min: 0,
            max: 600,
          },
        },
      },
    });
  }

  createChart2() {
    if (this.chart2) {
      this.chart2.destroy(); // Уничтожаем старый график, если он существует
    }

    // Извлечение температур из второй сушилки
    const temperatures2 = this.sushilkaData2.temperatures;
    const tempData2_1 = temperatures2['Температура в топке'] || 0;
    const tempData2_2 = temperatures2['Температура в камере смешения'] || 0;
    const tempData2_3 = temperatures2['Температура уходящих газов'] || 0;

    // Создаем временные метки (например, для последних 30 минут)
    const now = new Date();
    const timeStamps = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (30 - i) * 60 * 1000);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }).reverse();

    // Создаем массивы данных для графика
    const tempDataArray2_1 = Array(30).fill(tempData2_1);
    const tempDataArray2_2 = Array(30).fill(tempData2_2);
    const tempDataArray2_3 = Array(30).fill(tempData2_3);

    // Создаем график
    this.chart2 = new Chart(this.myChart2.nativeElement, {
      type: 'line',
      data: {
        labels: timeStamps,
        datasets: [
          {
            label: 'Температура в топке',
            data: tempDataArray2_1,
            fill: false,
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgb(255, 205, 86)',
            tension: 0.1,
            pointRadius: 0,
          },
          {
            label: 'Температура в камере смешения',
            data: tempDataArray2_2,
            fill: false,
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgb(153, 102, 255)',
            tension: 0.1,
            pointRadius: 0,
          },
          {
            label: 'Температура уходящих газов',
            data: tempDataArray2_3,
            fill: false,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgb(255, 159, 64)',
            tension: 0.1,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'График Сушилки №2', // Заголовок для второго графика
            color: 'green', // Цвет заголовка
            font: {
              size: 20, // Размер шрифта заголовка
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Время (минуты)',
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Температура (°C)',
            },
            beginAtZero: true,
            min: 0,
            max: 600,
          },
        },
      },
    });
  }
}
