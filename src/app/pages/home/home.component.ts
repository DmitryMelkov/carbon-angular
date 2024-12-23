import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushilkaComponent } from '../sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemoComponent } from '../sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SushilkaComponent, SushilkaMnemoComponent, MatTabsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  sushilkaIds = ['sushilka1', 'sushilka2']; // Массив с ID сушилок
  selectedSushilkaId: string = this.sushilkaIds[0]; // Выбранная сушилка по умолчанию
  activeView: 'parameters' | 'mnemo' = 'parameters'; // Текущее отображаемое представление

  // Метод для обработки завершения загрузки
  onLoadingComplete() {
    // Здесь вы можете добавить логику, которая будет выполняться после загрузки данных
  }

  // Метод для отображения текущих параметров
  showParameters(id: string) {
    this.selectedSushilkaId = id;
    this.activeView = 'parameters';
  }

  // Метод для отображения мнемосхемы
  showMnemo(id: string) {
    this.selectedSushilkaId = id;
    this.activeView = 'mnemo';
  }
}
