import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushilkaComponent } from '../sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemoComponent } from '../sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ControlButtonComponent } from '../../components/control-button/control-button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SushilkaComponent, SushilkaMnemoComponent, MatTabsModule, ControlButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  objectData = [
    { id: 'sushilka1', name: 'Сушилка №1' },
    { id: 'sushilka2', name: 'Сушилка №2' },
  ];
  selectedSushilkaId: string = this.objectData[0].id; // Выбранный объект по умолчанию
  activeView: 'parameters' | 'mnemo' = 'parameters'; // Текущее отображаемое представление

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
