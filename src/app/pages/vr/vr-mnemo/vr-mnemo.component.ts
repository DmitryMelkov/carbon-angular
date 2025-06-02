import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subject, Subscription, interval } from 'rxjs';
import { switchMap, startWith, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { VrData, VrTime } from '../../../common/types/vr-data';
import { VrService } from '../../../common/services/vr/vr.service';
import { NotisVrService } from '../../../common/services/vr/notis-vr.service';
import { NotisData } from '../../../common/types/notis-data';
import { MnemoKranComponent } from '../../../components/mnemo-kran/mnemo-kran.component';
import { LevelIndicatorComponent } from '../../../components/level-indicator/level-indicator.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DocumentationModalComponent } from './documentation-modal/documentation-modal.component';
import { ParamIndicatorComponent } from './param-indicator/param-indicator.component';
import { ModeVrService } from '../../../common/services/vr/mode-vr.service';
import { LabCurrentComponent } from '../../../components/laboratory/lab-current/lab-current.component';
import { LabModalComponent } from '../../../components/laboratory/lab-modal/lab-modal.component';
import { AlarmTableComponent } from './alarm-table/alarm-table.component';
import { AlarmService } from '../../../common/services/vr/alarm.service';
import { SirenComponent } from './siren/siren.component';
import { fadeInAnimation } from '../../../common/animations/animations';
import { LabInstructionModalComponent } from './lab-instruction-modal/lab-instruction-modal.component';
import { VrTimeService } from '../../../common/services/vr/vr-time.service';

@Component({
  selector: 'app-vr-mnemo',
  standalone: true,
  providers: [ModeVrService],
  imports: [
    HeaderCurrentParamsComponent,
    LoaderComponent,
    CommonModule,
    MnemoKranComponent,
    LevelIndicatorComponent,
    MatTooltipModule,
    MatDialogModule,
    ControlButtonComponent,
    ParamIndicatorComponent,
    LabCurrentComponent,
    AlarmTableComponent,
    SirenComponent, // Подключаем компонент сирены
  ],
  templateUrl: './vr-mnemo.component.html',
  styleUrls: ['./vr-mnemo.component.scss'],
  animations: [fadeInAnimation],
})
export class VrMnemoComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  data: VrData | null = null;
  notisData: NotisData | null = null;
  timeData: VrTime | null = null;
  isLoading: boolean = true;
  isTooltipsEnabled: boolean = true;
  mode: string | null = null;
  isImageLoaded: boolean = false;

  // Переменная для определения состояния тревоги
  isAlarmActive: boolean = false;
  private alarmSubscription!: Subscription;

  // RxJS Subject для остановки всех подписок
  private destroy$ = new Subject<void>();

  // Текстовые константы для описания приборов
  termopara1000: string =
    'Прибор: Термопара (1000мм)\nДиапазон: 0...+1000°C\nГрадуировка: ХА (К)';
  termopara400: string =
    'Прибор: Термопара (400мм)\nДиапазон: 0...+1000°C\nГрадуировка: ХА (К)';
  tcm50m: string =
    'Прибор: ТСМ-50М\nДиапазон: -50...+180°C\nТоковый выход: 4 - 20 мА';
  vBarabaneKotla: string =
    'Прибор: АИР-20/М2-Н-ДД\nДиапазон: 0...4 кПа\nТоковый выход: 4 - 20 мА';
  davlScrubber: string =
    'Прибор: ПД-1.М.Н1.42\nДиапазон: 0...0,25 кПа\nТоковый выход: 4 - 20 мА';
  davlKotel: string =
    'Прибор: Метран-55-ДИ\nДиапазон: 0...1,6 МПа\nТоковый выход: 4 - 20 мА';
  davlTopka: string =
    'Прибор: ПД-1.ТН.42\nДиапазон: -0,125...+0,125 кПа\nТоковый выход: 4 - 20 мА';
  davlNizKamery: string =
    'Прибор: ПД-1.Т1.42\nДиапазон: 0...-0,25 кПа\nТоковый выход: 4 - 20 мА';

  constructor(
    private vrService: VrService,
    private vrTimeService: VrTimeService,
    private route: ActivatedRoute,
    private notisVrService: NotisVrService,
    private dialog: MatDialog,
    private modeVrService: ModeVrService,
    private alarmService: AlarmService
  ) {}

  ngOnInit(): void {
    // Если id не передан через Input, пытаемся получить его из маршрута
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
    }
    if (!this.id) {
      console.error('ID VR не указан!');
      return;
    }

    // Загрузка данных сразу при инициализации
    this.loadData();

    // Запуск поллинга с использованием RxJS.
    // При уничтожении компонента подписка завершится благодаря takeUntil(this.destroy$)
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() =>
          forkJoin({
            vrData: this.vrService.getVrData(this.id),
            notisData: this.notisVrService.getNotisData(this.id),
            timeData: this.vrTimeService.getVrTime(this.id),
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.data = response.vrData;
          this.timeData = response.timeData;
          this.notisData = response.notisData;
          this.updateMode();
          // Если ранее стоял флаг загрузки, его можно сбросить
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка при загрузке данных:', error);
          this.isLoading = false;
        },
      });

    // Подписка на изменения тревог из AlarmService
    this.alarmSubscription = this.alarmService.alarms$.subscribe((alarms) => {
      this.isAlarmActive = Object.keys(alarms).length > 0;
    });
  }

  ngOnDestroy(): void {
    // Отправляем сигнал для завершения подписок
    this.destroy$.next();
    this.destroy$.complete();

    // Отписываемся от подписки тревог
    this.alarmSubscription?.unsubscribe();
  }

  private loadData(): void {
    // Загрузка данных единожды (если требуется сразу показать данные до начала поллинга)
    this.isLoading = true;
    forkJoin({
      vrData: this.vrService.getVrData(this.id),
      notisData: this.notisVrService.getNotisData(this.id),
      timeData: this.vrTimeService.getVrTime(this.id),
    }).subscribe({
      next: (response) => {
        this.data = response.vrData;
        this.timeData = response.timeData;
        this.notisData = response.notisData;
        this.updateMode();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ошибка при загрузке данных:', error);
        this.isLoading = false;
      },
    });
  }

  private updateMode(): void {
    if (this.data) {
      const mode = this.modeVrService.determineMode(this.data);
      this.modeVrService.setCurrentMode(mode);
      this.mode = mode;
    }
  }

  toggleTooltips(): void {
    this.isTooltipsEnabled = !this.isTooltipsEnabled;
  }

  openDocumentation(): void {
    this.dialog.open(DocumentationModalComponent, {
      minWidth: '600px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      data: { content: 'Это тестовый контент для документации объекта.' },
    });
  }

  openLab(): void {
    this.dialog.open(LabModalComponent, {
      minWidth: '600px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      data: {
        content: 'Это тестовый контент для документации объекта.',
        vrId: this.id,
      },
    });
  }

  openLabInstruction(): void {
    this.dialog.open(LabInstructionModalComponent, {
      minWidth: '600px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      data: { content: 'Это тестовый контент для документации объекта.' },
    });
  }

  onImageLoad(): void {
    this.isImageLoaded = true;
  }

  isKran5Active(): boolean {
    const value = this.data?.im?.['ИМ5 котел-утилизатор'];
    return typeof value === 'number' && value > 5;
  }
}
