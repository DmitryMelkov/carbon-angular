import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnergyResourcesReportMonthData } from '../../../common/types/energy-resources-report-month-data';
import { EnergyResourcesReportMonthService } from '../../../common/services/energy-resources/energy-resources-report-month.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EnergyResourcesNotChangeModalComponent } from './energy-resources-not-change-modal/energy-resources-not-change-modal.component';
import { EnergyResourcesPasswordModalComponent } from './energy-resources-password-modal/energy-resources-password-modal.component';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-energy-resources-report-month',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    ControlButtonComponent,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './energy-resources-report-month.component.html',
  styleUrls: ['./energy-resources-report-month.component.scss'],
})
export class EnergyResourcesReportMonthComponent implements OnInit, OnDestroy {
  reportData: EnergyResourcesReportMonthData[] = [];
  originalData: EnergyResourcesReportMonthData[] = [];
  selectedMonth: Date = new Date(); // Изменяем тип на Date
  isLoading: boolean = false;
  errorMessage: string | null = null;
  totals: any = {
    DE093: 0,
    DD972: 0,
    DD973: 0,
    DD576: 0,
    DD569: 0,
    DD923: 0,
    DD924: 0,
  };
  private subscription: Subscription | undefined;
  isDatepickerOpen: boolean = false;

  constructor(
    private reportService: EnergyResourcesReportMonthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setCurrentMonth();
    this.loadDataForSelectedMonth();
  }

  setCurrentMonth(): void {
    this.selectedMonth = new Date();
  }

  // Функция для получения названия месяца
  getMonthName(date: Date): string {
    const monthNames = [
      'январь',
      'февраль',
      'март',
      'апрель',
      'май',
      'июнь',
      'июль',
      'август',
      'сентябрь',
      'октябрь',
      'ноябрь',
      'декабрь',
    ];
    return monthNames[date.getMonth()];
  }

  loadDataForSelectedMonth(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const year = this.selectedMonth.getFullYear();
    const month = String(this.selectedMonth.getMonth() + 1).padStart(2, '0');

    this.subscription = this.reportService
      .getReportDataMonth(`${year}-${month}`)
      .subscribe({
        next: (data) => {
          this.reportData = data;
          this.originalData = JSON.parse(JSON.stringify(data));
          this.updateTotals();
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

  saveChanges(): void {
    const modifications = this.collectModifiedData();

    if (modifications.length === 0) {
      this.dialog.open(EnergyResourcesNotChangeModalComponent);
      return;
    }

    const dialogRef = this.dialog.open(EnergyResourcesPasswordModalComponent);

    dialogRef.afterClosed().subscribe((password) => {
      if (password) {
        this.reportService
          .correctReportData(modifications, password)
          .subscribe({
            next: () => {
              console.log('Изменения успешно сохранены.');
              this.loadDataForSelectedMonth();
            },
            error: (error) => {
              console.error('Ошибка при сохранении изменений:', error);
              alert('Пароль неверный или произошла ошибка при сохранении.');
            },
          });
      } else {
        console.warn('Пароль не был введен.');
      }
    });
  }

  collectModifiedData(): any[] {
    const modifications: any[] = [];

    this.reportData.forEach((currentData) => {
      const originalData = this.originalData.find(
        (data) => data.day === currentData.day
      );
      if (originalData) {
        ['DE093', 'DD972', 'DD973', 'DD576', 'DD569', 'DD923', 'DD924'].forEach(
          (model) => {
            const currentValue =
              currentData[model as keyof EnergyResourcesReportMonthData];
            const originalValue =
              originalData[model as keyof EnergyResourcesReportMonthData];

            if (currentValue !== originalValue) {
              const valueToSave =
                currentValue === '' ||
                currentValue === null ||
                isNaN(Number(currentValue))
                  ? 0
                  : Number(currentValue);

              modifications.push({
                day: currentData.day,
                model: model,
                value: valueToSave,
              });
            }
          }
        );
      } else {
        console.warn(
          `Оригинальные данные для дня ${currentData.day} не найдены.`
        );
      }
    });

    return modifications;
  }

  updateTotals(): void {
    this.totals = {
      DE093: this.calculateTotal('DE093').toFixed(2),
      DD972: this.calculateTotal('DD972').toFixed(2),
      DD973: this.calculateTotal('DD973').toFixed(2),
      DD576: this.calculateTotal('DD576').toFixed(2),
      DD569: this.calculateTotal('DD569').toFixed(2),
      DD923: this.calculateTotal('DD923').toFixed(2),
      DD924: this.calculateTotal('DD924').toFixed(2),
    };
  }

  private calculateTotal(model: string): number {
    return this.reportData.reduce((sum, currentData) => {
      const value = currentData[model as keyof EnergyResourcesReportMonthData];
      const numericValue = Number(value);
      return sum + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
  }

  onMonthChange(event: Date): void {
    if (event instanceof Date) {
      this.selectedMonth = event; // Сохраняем объект Date
      this.loadDataForSelectedMonth();
      this.isDatepickerOpen = false;
    } else {
      console.error('Неверный формат месяца:', event);
    }
  }

  preventKeydown(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openDatepicker(): void {
    this.isDatepickerOpen = true;
  }

  onLoadingComplete(): void {
    this.isLoading = false;
  }
}
