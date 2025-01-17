import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnergyResourcesReportData } from '../../../common/types/energy-resources-report-day-data';
import { EnergyResourcesReportDayService } from '../../../common/services/energy-resources/energy-resources-report-day.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { Subscription } from 'rxjs';
import { MonthPickerComponent } from '../../../components/month-picker/month-picker.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-energy-resources-report-day',
  standalone: true,
  imports: [CommonModule, LoaderComponent, MonthPickerComponent],
  templateUrl: './energy-resources-report-day.component.html',
  styleUrls: ['./energy-resources-report-day.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // Начальное состояние
      state('*', style({ opacity: 1 })), // Конечное состояние
      transition('void => *', animate('0.3s ease-in-out')), // Анимация появления
    ]),
  ],
})
export class EnergyResourcesReportDayComponent implements OnInit, OnDestroy {
  reportData: EnergyResourcesReportData[] = [];
  selectedDate: Date = new Date(); // Тип Date
  isLoading: boolean = false;
  isDataLoaded: boolean = false; // Управление анимацией
  errorMessage: string | null = null;
  private subscription: Subscription | undefined;

  constructor(private reportService: EnergyResourcesReportDayService) {}

  ngOnInit(): void {
    this.loadDataForSelectedDate();
  }

  loadDataForSelectedDate(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.isDataLoaded = false; // Сбрасываем флаг перед загрузкой данных

    const dateString = this.selectedDate.toISOString().split('T')[0]; // Преобразуем в строку

    this.subscription = this.reportService
      .getReportData(dateString)
      .subscribe({
        next: (data) => {
          this.reportData = this.formatDataByTimeSlot(data);
          this.isLoading = false;
          this.isDataLoaded = true; // Включаем анимацию
        },
        error: (error) => {
          console.error('Ошибка при загрузке данных:', error);
          this.errorMessage =
            'Произошла ошибка при загрузке данных. Попробуйте позже.';
          this.isLoading = false;
          this.isDataLoaded = true; // Включаем анимацию даже при ошибке
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  formatDataByTimeSlot(
    reportData: EnergyResourcesReportData[]
  ): EnergyResourcesReportData[] {
    return reportData.sort((a, b) => {
      const timeA =
        a.time === '24:00' ? [24, 0] : a.time.split(':').map(Number);
      const timeB =
        b.time === '24:00' ? [24, 0] : b.time.split(':').map(Number);
      return timeA[0] - timeB[0] || timeA[1] - timeB[1];
    });
  }

  calculateTotals(): Record<string, number> {
    const totals: Record<string, number> = {
      DE093: 0,
      DD972: 0,
      DD973: 0,
      DD576: 0,
      DD569: 0,
      DD923: 0,
      DD924: 0,
    };

    this.reportData.forEach((item) => {
      totals['DE093'] += item['DE093'] === '-' ? 0 : Number(item['DE093']);
      totals['DD972'] += item['DD972'] === '-' ? 0 : Number(item['DD972']);
      totals['DD973'] += item['DD973'] === '-' ? 0 : Number(item['DD973']);
      totals['DD576'] += item['DD576'] === '-' ? 0 : Number(item['DD576']);
      totals['DD569'] += item['DD569'] === '-' ? 0 : Number(item['DD569']);
      totals['DD923'] += item['DD923'] === '-' ? 0 : Number(item['DD923']);
      totals['DD924'] += item['DD924'] === '-' ? 0 : Number(item['DD924']);
    });

    return totals;
  }

  onDateChange(date: Date): void {
    this.selectedDate = date; // Принимаем объект Date
    this.loadDataForSelectedDate(); // Автоматически загружаем данные
  }

  onLoadingComplete(): void {
    this.isLoading = false;
  }
}
