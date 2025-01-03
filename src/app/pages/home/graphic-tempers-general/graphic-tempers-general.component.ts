import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { SushilkaGraphTemperComponent } from '../../sushilki/sushilka-graph-temper/sushilka-graph-temper.component';

@Component({
  selector: 'app-graphic-tempers-general',
  standalone: true,
  imports: [ControlButtonComponent, SushilkaGraphTemperComponent],
  templateUrl: './graphic-tempers-general.component.html',
  styleUrl: './graphic-tempers-general.component.scss'
})
export class GraphicTempersGeneralComponent {
  timeRange: number = 10; // Устанавливаем 10 минут по умолчанию
  activeButton: number = 10; // Устанавливаем активную кнопку по умолчанию на 10 минут

  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
