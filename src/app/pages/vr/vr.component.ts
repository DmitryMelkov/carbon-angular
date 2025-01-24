import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, of, Subject } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeaderCurrentParamsComponent } from '../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { VrData } from '../../common/types/vr-data';
import { VrService } from '../../common/services/vr/vr.service';
import { GeneralTableComponent } from '../../components/general-table/general-table.component';

@Component({
  selector: 'app-vr',
  standalone: true,
  imports: [
    HeaderCurrentParamsComponent,
    LoaderComponent,
    CommonModule,
    GeneralTableComponent
  ],
  templateUrl: './vr.component.html',
  styleUrls: ['./vr.component.scss'],
})
export class VrComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  data: VrData | null = null;
  isLoading: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private vrService: VrService,
    private route: ActivatedRoute
  ) {}

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
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.isLoading = true;
    this.vrService.getVrData(this.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при загрузке данных:', error);
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        this.data = response;
        this.isLoading = false;
      });
  }

  private startPeriodicDataLoading(): void {
    interval(10000)
      .pipe(
        switchMap(() => this.vrService.getVrData(this.id)),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при получении данных:', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        this.data = response;
      });
  }
}
