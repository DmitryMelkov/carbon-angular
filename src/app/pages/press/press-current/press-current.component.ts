// src/app/pages/press/press-current/press-current.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { interval, Subject, of } from 'rxjs';
import { switchMap, catchError, takeUntil, delay, startWith } from 'rxjs/operators';
import { PressData } from '../../../common/types/press-data';
import { GeneralTableComponent } from '../../../components/general-table/general-table.component';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { PressService } from '../../../common/services/press/press.service';
import { fadeInAnimation } from '../../../common/animations/animations';

@Component({
  selector: 'app-press-current',
  standalone: true,
  imports: [
    GeneralTableComponent,
    HeaderCurrentParamsComponent,
    LoaderComponent,
    CommonModule,
  ],
  templateUrl: './press-current.component.html',
  styleUrls: ['./press-current.component.scss'],
  animations: [fadeInAnimation],
})
export class PressCurrentComponent implements OnInit, OnDestroy {
  @Input() id!: string; // ID пресса
  @Input() contentType!: string; // Тип контента

  data: PressData | null = null;
  isLoading: boolean = true;
  isDataLoaded: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private pressService: PressService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
    }

    if (!this.id) {
      console.error('ID пресса не указан!');
      return;
    }

    this.loadData();
    this.startPeriodicDataLoading();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] || changes['contentType']) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.isLoading = true;
    this.pressService
      .getPressData(this.id)
      .pipe(
        delay(1000),
        catchError((error) => {
          console.error('Ошибка при загрузке данных:', error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: PressData | null) => {
        this.updateData(response);
        this.onLoadingComplete();
      });
  }

  private startPeriodicDataLoading(): void {
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.pressService.getPressData(this.id).pipe(
            catchError((error) => {
              console.error('Ошибка при периодической загрузке данных:', error);
              return of(null);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((response: PressData | null) => {
        this.updateData(response);
      });
  }

  private updateData(response: PressData | null): void {
    if (response) {
      this.data = response;
    } else {
      this.data = {
        controllerData: {
          "Статус работы": false,
          "Кол-во наработанных часов": 0,
        },
        termodatData: {
          "Температура масла": 0,
          "Давление масла": 0,
        },
        lastUpdated: '—',
      };
    }
    this.isDataLoaded = true;
  }

  onLoadingComplete(): void {
    this.isLoading = false;
  }
}