import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { LabData } from '../../../common/types/lab-data';
import { LabService } from '../../../common/services/vr/lab.service';
import { DataLoadingService } from '../../../common/services/data-loading.service'; // Импортируем сервис
import { CommonModule } from '@angular/common';
import { delay } from 'rxjs';
import { LoaderComponent } from '../../loader/loader.component';
import { fadeInAnimation } from '../../../common/animations/animations';

@Component({
  selector: 'app-lab-current',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './lab-current.component.html',
  styleUrls: ['./lab-current.component.scss'],
  animations: [fadeInAnimation]
})
export class LabCurrentComponent implements OnInit, OnDestroy {
  @Input() id: string = ''; // Принимаем ID печи как входной параметр
  labData: LabData | null = null; // Данные лаборатории
  isLoading: boolean = true; // Флаг загрузки
  isMPA: boolean = false;

  constructor(
    private labService: LabService,
    private dataLoadingService: DataLoadingService // Внедряем сервис
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.isMPA = this.id.toLowerCase().includes('mpa');
      this.loadLabData(); // Загружаем данные, если ID передан
      this.startPeriodicDataLoading(); // Запускаем периодическую загрузку данных
    }
  }

  ngOnDestroy(): void {
    this.dataLoadingService.stopPeriodicLoading(); // Останавливаем периодическую загрузку данных через сервис
  }

  private loadLabData(): void {
    this.isLoading = true;
    this.dataLoadingService.loadData(
      () => this.labService.getLabData(this.id).pipe(delay(1000)), // Добавляем задержку
      (data) => {
        this.labData = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Ошибка при загрузке данных из API:', error);
        this.isLoading = false;
      }
    );
  }


  private startPeriodicDataLoading(): void {
    this.dataLoadingService.startPeriodicLoading(
      () => this.labService.getLabData(this.id), // Функция для загрузки данных
      10000, // Интервал в миллисекундах (10 секунд)
      (data) => {
        this.labData = data; // Обработка успешной загрузки
      }
    );
  }
}
