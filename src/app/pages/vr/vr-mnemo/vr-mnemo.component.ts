import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { VrData } from '../../../common/types/vr-data';
import { VrService } from '../../../common/services/vr/vr.service';
import { ValueCheckService } from '../../../common/services/vr/value-check.service';
import {
  recommendedLevels,
  recommendedPressures,
  recommendedTemperatures,
  recommendedVacuums,
} from '../../../common/constans/vr-recomended-values';
import { DataLoadingService } from '../../../common/services/data-loading.service';
import { fadeInAnimation } from '../../../common/animations/animations';
import { ModeVrService } from '../../../common/services/vr/mode-vr.service';
import { NotisVrService } from '../../../common/services/vr/notis-vr.service';
import { NotisData } from '../../../common/types/notis-data';
import { MnemoKranComponent } from '../../../components/mnemo-kran/mnemo-kran.component';
import { LevelIndicatorComponent } from '../../../components/level-indicator/level-indicator.component';
import { blinkAnimation } from '../../../common/animations/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DocumentationModalComponent } from './documentation-modal/documentation-modal.component';

@Component({
  selector: 'app-vr-mnemo',
  standalone: true,
  imports: [
    LoaderComponent,
    CommonModule,
    MnemoKranComponent,
    LevelIndicatorComponent,
    MatTooltipModule,
    MatDialogModule,
    ControlButtonComponent,
  ],
  templateUrl: './vr-mnemo.component.html',
  styleUrls: ['./vr-mnemo.component.scss'],
  animations: [fadeInAnimation, blinkAnimation], // Добавляем blinkAnimation
})
export class VrMnemoComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  data: VrData | null = null;
  notisData: NotisData | null = null;
  isLoading: boolean = true;
  isTooltipsEnabled: boolean = true;
  mode: string | null = null;
  highlightedKeys: Set<string> = new Set();
  private destroy$ = new Subject<void>();
  isImageLoaded: boolean = false;

  recommendedTemperatures = recommendedTemperatures;
  recommendedLevels = recommendedLevels;
  recommendedPressures = recommendedPressures;
  recommendedVacuums = recommendedVacuums;

  constructor(
    private vrService: VrService,
    private route: ActivatedRoute,
    private valueCheckService: ValueCheckService,
    private dataLoadingService: DataLoadingService,
    private modeVrService: ModeVrService,
    private notisVrService: NotisVrService,
    private dialog: MatDialog
  ) {}

  // Метод для проверки, вышел ли параметр за пределы допустимого
  isAlarm(
    key: string,
    value: any,
    recommendedValues: Record<string, string>
  ): boolean {
    const isOutOfRange = this.valueCheckService.isOutOfRange(
      key,
      value,
      recommendedValues
    );
    return isOutOfRange;
  }

  ngOnInit(): void {
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
    }

    if (!this.id) {
      console.error('ID VR не указан!');
      return;
    }

    this.loadData();
    this.startPeriodicDataLoading();
  }

  ngOnDestroy(): void {
    this.dataLoadingService.stopPeriodicLoading();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.isLoading = true;

    this.dataLoadingService.loadData(
      () =>
        forkJoin({
          vrData: this.vrService.getVrData(this.id),
          notisData: this.notisVrService.getNotisData(this.id),
        }),
      (response) => {
        this.data = response.vrData;
        this.notisData = response.notisData;
        this.updateMode();
        this.isLoading = false;
      },
      (error) => {
        console.error('Ошибка при загрузке данных:', error);
        this.isLoading = false;
      }
    );
  }

  private startPeriodicDataLoading(): void {
    this.dataLoadingService.startPeriodicLoading(
      () =>
        forkJoin({
          vrData: this.vrService.getVrData(this.id),
          notisData: this.notisVrService.getNotisData(this.id),
        }),
      10000,
      (response) => {
        this.data = response.vrData;
        this.notisData = response.notisData;
        this.updateMode();
      }
    );
  }

  // Переключает режим всплывающих подсказок
  toggleTooltips(): void {
    this.isTooltipsEnabled = !this.isTooltipsEnabled;
  }

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

  // Открывает модальное окно с документацией
  openDocumentation(): void {
    this.dialog.open(DocumentationModalComponent, {
      minWidth: '300px',
      maxWidth: '90vw',
      data: { content: 'Это тестовый контент для документации объекта.' },
    });
  }

  private updateMode(): void {
    this.mode = this.modeVrService.determineMode(this.data); // Определяем режим
    this.modeVrService.updateRecommendedTemperatures(
      this.mode,
      this.recommendedTemperatures
    ); // Обновляем рекомендуемые значения
  }

  onImageLoad(): void {
    this.isImageLoaded = true;
  }

  // В компоненте VrMnemoComponent
  isKran5Active(): boolean {
    const value = this.data?.im?.['ИМ5 котел-утилизатор'];
    return typeof value === 'number' && value > 5; // Проверяем, что значение больше 5
  }
}
