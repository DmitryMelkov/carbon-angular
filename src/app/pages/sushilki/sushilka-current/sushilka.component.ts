import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushilkiService } from '../../../common/services/sushilka.service';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SushilkiData } from '../../../common/types/sushilki-data';
import { SushilkaTableComponent } from '../../../components/sushilka-table/sushilka-table.component';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';

@Component({
  selector: 'app-sushilka',
  standalone: true,
  imports: [CommonModule, SushilkaTableComponent, HeaderCurrentParamsComponent],
  templateUrl: './sushilka.component.html',
  styleUrls: ['./sushilka.component.scss'],
})
export class SushilkaComponent implements OnInit, OnDestroy {
  data: SushilkiData | null = null;
  private updateSubscription!: Subscription;

  id!: string; // ID сушилки

  constructor(
    private sushilkiService: SushilkiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Считываем параметр id из маршрута
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.id) {
      console.error('ID сушилки не указан!');
      return;
    }

    this.updateSubscription = interval(10000)
      .pipe(switchMap(() => this.sushilkiService.getSushilkaData(this.id)))
      .subscribe((response) => {
        this.updateData(response);
      });

    this.sushilkiService.getSushilkaData(this.id).subscribe((response) => {
      this.updateData(response);
    });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private updateData(response: SushilkiData): void {
    this.data = response || {
      temperatures: {},
      vacuums: {},
      gorelka: {},
      im: {},
      lastUpdated: '',
    };
  }
}
