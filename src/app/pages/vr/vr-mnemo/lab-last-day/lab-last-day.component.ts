import { Component, Input, OnInit } from '@angular/core';
import { LabLastDay } from '../../../../common/types/lab-data';
import { LabService } from '../../../../common/services/vr/lab.service';
import { CommonModule } from '@angular/common';
import { DataLoadingService } from '../../../../common/services/data-loading.service';
import { delay } from 'rxjs';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { fadeInAnimation } from '../../../../common/animations/animations';

@Component({
  selector: 'app-lab-last-day',
  imports: [CommonModule, LoaderComponent], // Добавьте LoaderComponent в imports
  templateUrl: './lab-last-day.component.html',
  styleUrls: ['./lab-last-day.component.scss'],
  animations: [fadeInAnimation]
})
export class LabLastDayComponent implements OnInit {
  @Input() vrId!: string;
  labData: LabLastDay[] = [];
  isLoading = true; // Установите isLoading в true при инициализации

  constructor(
    private labService: LabService,
    private dataLoadingService: DataLoadingService
  ) {}

  ngOnInit(): void {
    this.loadData(); // Первоначальная загрузка
    this.startPeriodicLoading();
  }

  ngOnDestroy(): void {
    this.dataLoadingService.stopPeriodicLoading();
  }

  public loadData(): void {
    if (this.vrId) {
      this.dataLoadingService.loadData<LabLastDay[]>(
        () => this.labService.getLastDayData(this.vrId).pipe(delay(1000)), // Функция загрузки
        (data) => {
          this.labData = data; // Обработка успешной загрузки
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading data:', error); // Обработка ошибок
          this.isLoading = false;
        }
      );
    }
  }

  private startPeriodicLoading(): void {
    if (this.vrId) {
      this.dataLoadingService.startPeriodicLoading<LabLastDay[]>(
        () => this.labService.getLastDayData(this.vrId), // Функция загрузки
        10000, // Интервал (10 секунд)
        (data) => {
          this.labData = data; // Обработка успешной загрузки
          this.isLoading = false;
        }
      );
    }
  }
}
