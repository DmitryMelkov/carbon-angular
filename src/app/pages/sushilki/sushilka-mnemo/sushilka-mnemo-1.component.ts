import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SushilkiService } from '../../../common/services/sushilka.service';
import { SushilkiData } from '../../../common/types/sushilki-data';
import { Subscription, switchMap, interval } from 'rxjs';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MnemoKranComponent } from '../../../components/mnemo-kran/mnemo-kran.component';
import { DocumentationModalComponent } from './documentation-modal/documentation-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-sushilka-mnemo-1',
  imports: [
    CommonModule,
    HeaderCurrentParamsComponent,
    MatTooltipModule,
    MnemoKranComponent,
    MatDialogModule,
  ],
  standalone: true,
  templateUrl: './sushilka-mnemo-1.component.html',
  styleUrl: './sushilka-mnemo-1.component.scss',
})
export class SushilkaMnemo1Component implements OnInit, OnDestroy {
  data: SushilkiData | null = null;
  id!: string;
  private updateSubscription!: Subscription;

  constructor(
    private sushilkiService: SushilkiService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    this.updateSubscription = interval(10000)
      .pipe(switchMap(() => this.sushilkiService.getSushilkaData(this.id)))
      .subscribe((response) => {
        this.data = response;
      });

    this.sushilkiService.getSushilkaData(this.id).subscribe((response) => {
      this.data = response;
    });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  isTooltipsEnabled: boolean = true; // Флаг для управления тултипами

  toggleTooltips(): void {
    this.isTooltipsEnabled = !this.isTooltipsEnabled;
  }

  kameraSmeshenia: string =
    'Прибор: Термопара (1000мм)\nДиапазон: -40...+1000°C\nГрадуировка: ХА (К)';

  topkaTemper: string =
    'Прибор: Термопара (1000мм)\nДиапазон: -40...+1000°C\nГрадуировка: ХА (К)';

  topkaDavl: string =
    'Прибор: ПД-1.ТН1\nДиапазон: -0,125...+0,125 кПа\nГрадуировка: 4-20 мА';

  vosduhNaRazbavl: string =
    'Прибор: ПД-1.Н1\nДиапазон: 0...5 кПа\nГрадуировка: 4-20 мА';

  kameraVigruzki: string =
    'Прибор: ПД-1Т\nДиапазон: 0...-200 Па\nГрадуировка: 4-20 мА';

  temperUhodyashihGazov: string =
    'Прибор: Термопара (320мм)\nДиапазон: -40...+1000°C\nГрадуировка: ХА (К)';

  openDocumentation(): void {
    this.dialog.open(DocumentationModalComponent, {
      minWidth: '300px',
      maxWidth: '90vw',
      data: { content: 'Это тестовый контент для документации объекта.' },
    });
  }
}
