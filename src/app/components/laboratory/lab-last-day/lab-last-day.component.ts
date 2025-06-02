import { Component, Input, OnInit } from '@angular/core';
import { LabLastDay } from '../../../common/types/lab-data';
import { LabService } from '../../../common/services/vr/lab.service';
import { CommonModule } from '@angular/common';
import { DataLoadingService } from '../../../common/services/data-loading.service';
import { delay } from 'rxjs';
import { LoaderComponent } from '../../loader/loader.component';
import { fadeInAnimation } from '../../../common/animations/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { LabPasswordDialogComponent } from '../lab-password-dialog/lab-password-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lab-last-day',
  imports: [CommonModule, LoaderComponent, MatIcon],
  templateUrl: './lab-last-day.component.html',
  styleUrls: ['./lab-last-day.component.scss'],
  animations: [fadeInAnimation],
})
export class LabLastDayComponent implements OnInit {
  @Input() vrId!: string;
  labData: LabLastDay[] = [];
  isLoading = true; // Установите isLoading в true при инициализации
  isMPA: boolean = false;

  constructor(
    private labService: LabService,
    private dataLoadingService: DataLoadingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isMPA = this.vrId.toLowerCase().includes('mpa');
    this.loadData(); // Первоначальная загрузка
    this.startPeriodicLoading();
  }

  ngOnDestroy(): void {
    this.dataLoadingService.stopPeriodicLoading();
  }

  private sortLabData(data: LabLastDay[]): LabLastDay[] {
    return data.sort((a, b) => {
      // Проверяем, что recordDate и recordTime не пустые
      if (!a.recordDate || !a.recordTime || !b.recordDate || !b.recordTime) {
        return 0; // или обработайте это как нужно
      }

      // Преобразуем дату из формата DD.MM.YYYY в YYYY-MM-DD
      const [dayA, monthA, yearA] = a.recordDate.split('.');
      const [dayB, monthB, yearB] = b.recordDate.split('.');

      const dateA = new Date(`${yearA}-${monthA}-${dayA}T${a.recordTime}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}T${b.recordTime}`);

      return dateB.getTime() - dateA.getTime(); // Сортировка от новых к старым
    });
  }

  public loadData(): void {
    if (this.vrId) {
      this.dataLoadingService.loadData<LabLastDay[]>(
        () => this.labService.getLastDayData(this.vrId).pipe(delay(1000)),
        (data) => {
          console.log('Received data:', data); // Логируем полученные данные
          this.labData = this.sortLabData(data);
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading data:', error);
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
          this.labData = this.sortLabData(data);
          this.isLoading = false;
        }
      );
    }
  }




  public deleteRecord(recordId: string): void {
    const dialogRef = this.dialog.open(LabPasswordDialogComponent);

    dialogRef.afterClosed().subscribe((password: string) => {
      if (password) {
        this.labService.deleteLabData(this.vrId, recordId).subscribe({
          next: () => {
            this.labData = this.labData.filter(item => item._id !== recordId);
            this.snackBar.open('Запись удалена', 'Закрыть', { duration: 2000 });
          },
          error: (error) => {
            console.error('Ошибка при удалении:', error);
            this.snackBar.open(
              `Ошибка: ${error.error?.message || 'Неизвестная ошибка'}`,
              'Закрыть',
              { duration: 5000 }
            );
          }
        });
      }
    });
  }
}
