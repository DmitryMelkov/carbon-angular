import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnergyResourcesReportMonthData } from '../../../common/types/energy-resources-report-month-data';
import { EnergyResourcesReportMonthService } from '../../../common/services/energy-resources/energy-resources-report-month.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EnergyResourcesNotChangeModalComponent } from './energy-resources-not-change-modal/energy-resources-not-change-modal.component';
import { EnergyResourcesPasswordModalComponent } from './energy-resources-password-modal/energy-resources-password-modal.component';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-energy-resources-report-month',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './energy-resources-report-month.component.html',
  styleUrls: ['./energy-resources-report-month.component.scss'],
})
export class EnergyResourcesReportMonthComponent implements OnInit, OnDestroy {
  reportData: EnergyResourcesReportMonthData[] = [];
  selectedMonth: string = '';
  loading: boolean = false;
  errorMessage: string | null = null;
  private subscription: Subscription | undefined;

  constructor(
    private reportService: EnergyResourcesReportMonthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setCurrentMonth();
    this.loadDataForSelectedMonth();
  }

  setCurrentMonth(): void {
    const today = new Date();
    this.selectedMonth = today.toISOString().slice(0, 7);
  }

  loadDataForSelectedMonth(): void {
    this.loading = true;
    this.errorMessage = null;

    this.subscription = this.reportService.getReportDataMonth(this.selectedMonth).subscribe({
      next: (data) => {
        this.reportData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Ошибка при загрузке данных:', error);
        this.errorMessage = 'Произошла ошибка при загрузке данных. Попробуйте позже.';
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  saveChanges(): void {
    const modifications = this.collectModifiedData();

    if (modifications.length === 0) {
      this.dialog.open(EnergyResourcesNotChangeModalComponent);
      return;
    }

    const dialogRef = this.dialog.open(EnergyResourcesPasswordModalComponent);

    dialogRef.afterClosed().subscribe((password) => {
      if (password) {
        this.reportService.correctReportData(modifications, password).subscribe({
          next: () => {
            this.loadDataForSelectedMonth();
          },
          error: (error) => {
            console.error('Ошибка при сохранении изменений:', error);
            alert('Пароль неверный или произошла ошибка при сохранении.');
          },
        });
      }
    });
  }

  collectModifiedData(): any[] {
    const modifications: any[] = [];
    // Логика для сбора изменений из таблицы
    this.reportData.forEach((dayData) => {
      // Добавьте логику для проверки изменений
    });
    return modifications;
  }
}
