// sushilka-graph-temper.component.ts
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SushilkiService } from '../../../common/services/sushilka.service';
import { SushilkiData } from '../../../common/types/sushilki-data';
import { GraphService } from '../../../common/services/graph.service';
import { Chart } from 'chart.js';

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

  sushilkaData1!: SushilkiData;
  sushilkaData2!: SushilkiData;
  timeRange: '30min' | '24h' = '30min';

  constructor(private sushilkiService: SushilkiService, private graphService: GraphService) {}

  ngAfterViewInit(): void {
    Promise.all([
      this.getSushilkaData('sushilka1'),
      this.getSushilkaData('sushilka2'),
    ]).then(() => {
      this.updateCharts();
    });
  }

  getSushilkaData(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.sushilkiService.getSushilkaData(id).subscribe((data) => {
        if (id === 'sushilka1') {
          this.sushilkaData1 = data;
        } else if (id === 'sushilka2') {
          this.sushilkaData2 = data;
        }
        resolve();
      });
    });
  }

  updateCharts() {
    const timeStamps = this.graphService.generateTimeStamps(this.timeRange);

    if (this.chart1) {
      this.chart1.destroy();
    }
    if (this.chart2) {
      this.chart2.destroy();
    }

    const datasets1 = this.graphService.createDatasets(this.sushilkaData1, this.timeRange);
    const datasets2 = this.graphService.createDatasets(this.sushilkaData2, this.timeRange);

    this.chart1 = this.graphService.createChart(this.myChart1.nativeElement, timeStamps, datasets1, 'График Сушилки №1');
    this.chart2 = this.graphService.createChart(this.myChart2.nativeElement, timeStamps, datasets2, 'График Сушилки №2');
  }

  switchTimeRange(range: '30min' | '24h') {
    this.timeRange = range;
    this.updateCharts();
  }
}
