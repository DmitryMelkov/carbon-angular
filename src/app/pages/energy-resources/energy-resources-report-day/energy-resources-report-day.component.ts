import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnergyResourcesReportData } from '../../../common/types/energy-resources-report-day-data';
import { EnergyResourcesReportDayService } from '../../../common/services/energy-resources/energy-resources-report-day.service';
import { CommonModule } from '@angular/common';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-energy-resources-report-day',
  standalone: true,
  imports: [CommonModule, ControlButtonComponent, LoaderComponent],
  templateUrl: './energy-resources-report-day.component.html',
  styleUrls: ['./energy-resources-report-day.component.scss'],
})
export class EnergyResourcesReportDayComponent implements OnInit, OnDestroy {
  reportData: EnergyResourcesReportData[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  private subscription: Subscription | undefined; // Объявляем переменную для подписки

  constructor(private reportService: EnergyResourcesReportDayService) {}

  ngOnInit(): void {
    this.loadDataForSelectedDate();
  }

  loadDataForSelectedDate(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Сохраняем подписку
    this.subscription = this.reportService
      .getReportData(this.selectedDate)
      .subscribe({
        next: (data) => {
          this.reportData = this.formatDataByTimeSlot(data);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка при загрузке данных:', error);
          this.errorMessage =
            'Произошла ошибка при загрузке данных. Попробуйте позже.';
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    // Отписываемся от подписки, если она существует
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

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
  }

  onLoadingComplete(): void {
    this.isLoading = false; // Убираем прелоудер, когда загрузка завершена
  }
}
