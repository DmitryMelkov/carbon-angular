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
import { MonthPickerComponent } from '../../../components/month-picker/month-picker.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-energy-resources-report-month',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    ControlButtonComponent,
    MonthPickerComponent,
  ],
  templateUrl: './energy-resources-report-month.component.html',
  styleUrls: ['./energy-resources-report-month.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // Начальное состояние
      state('*', style({ opacity: 1 })), // Конечное состояние
      transition('void => *', animate('0.3s ease-in-out')), // Анимация появления
    ]),
  ],
})
export class EnergyResourcesReportMonthComponent implements OnInit, OnDestroy {
  reportData: EnergyResourcesReportMonthData[] = [];
  originalData: EnergyResourcesReportMonthData[] = [];
  selectedMonth: string = '';
  isLoading: boolean = false;
  isDataLoaded: boolean = false; // Управление анимацией
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

  constructor(
    private reportService: EnergyResourcesReportMonthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setCurrentMonth();
    this.loadDataForSelectedMonth();
  }

  setCurrentMonth(): void {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    this.selectedMonth = `${year}-${month}-01`; // Установите день на 1
  }

  loadDataForSelectedMonth(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.isDataLoaded = false; // Сбрасываем флаг перед загрузкой данных

    const [year, month] = this.selectedMonth.split('-');

    this.subscription = this.reportService
      .getReportDataMonth(`${year}-${month}`)
      .subscribe({
        next: (data) => {
          this.reportData = data;
          this.originalData = JSON.parse(JSON.stringify(data)); // Сохраняем копию исходных данных
          this.updateTotals();
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
              this.loadDataForSelectedMonth(); // Перезагружаем данные после успешного сохранения
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

            // Проверка на изменения
            if (currentValue !== originalValue) {
              // Убедитесь, что currentValue не является NaN или пустой строкой
              const valueToSave =
                currentValue === '' ||
                currentValue === null ||
                isNaN(Number(currentValue))
                  ? 0
                  : Number(currentValue); // Преобразуем currentValue в число

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
      // Проверяем, является ли значение числом
      const numericValue = Number(value);
      return sum + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
  }

  onMonthChange(event: Date): void {
    if (event instanceof Date) {
      const year = event.getFullYear();
      const month = String(event.getMonth() + 1).padStart(2, '0');
      this.selectedMonth = `${year}-${month}-01`;
      this.loadDataForSelectedMonth();
    } else {
      console.error('Неверный формат месяца:', event);
    }
  }

  onLoadingComplete(): void {
    this.isLoading = false; // Убираем прелоудер, когда загрузка завершена
  }
}
