import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushilkaService } from '../../../services/sushilka.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sushilka2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sushilka2.component.html',
  styleUrls: ['./sushilka2.component.scss'],
})
export class Sushilka2Component implements OnInit, OnDestroy {
  data: any;
  private updateSubscription!: Subscription;

  constructor(private sushilkaService: SushilkaService) {}

  ngOnInit(): void {
    // Создаем интервал обновления каждые 10 секунд
    this.updateSubscription = interval(10000)
      .pipe(
        switchMap(() => this.sushilkaService.getSushilka2Data()) // Выполняем запрос на сервер
      )
      .subscribe((response) => {
        this.data = response; // Обновляем данные
      });

    // Начальная загрузка данных
    this.sushilkaService.getSushilka2Data().subscribe((response) => {
      this.data = response;
    });
  }

  ngOnDestroy(): void {
    // Отписываемся от обновления, чтобы избежать утечек памяти
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}
