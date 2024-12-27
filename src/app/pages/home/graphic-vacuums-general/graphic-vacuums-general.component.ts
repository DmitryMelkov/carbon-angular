import { Component } from '@angular/core';
import { SushilkaGraphVacuumsComponent } from '../../sushilki/sushilka-graph-davl/sushilka-graph-vacuums.component';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';

@Component({
  selector: 'app-graphic-vacuums-general',
  templateUrl: './graphic-vacuums-general.component.html',
  styleUrls: ['./graphic-vacuums-general.component.scss'],
  standalone: true,
  imports: [SushilkaGraphVacuumsComponent, ControlButtonComponent],
})
export class GraphicVacuumsGeneralComponent {
  timeRange: number = 10; // Устанавливаем 10 минут по умолчанию
  activeButton: number = 10; // Устанавливаем активную кнопку по умолчанию на 10 минут

  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
