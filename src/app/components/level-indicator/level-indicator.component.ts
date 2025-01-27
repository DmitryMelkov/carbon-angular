import { Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-level-indicator',
  standalone: true, // standalone компонент
  imports: [CommonModule], // Импортируем CommonModule
  templateUrl: './level-indicator.component.html',
  styleUrls: ['./level-indicator.component.scss'],
})
export class LevelIndicatorComponent implements OnInit, OnDestroy {
  @Input() objectNumber?: number;
  @Input() data: any;
  @Input() minLevel: number = 0;
  @Input() maxLevel: number = 100;
  @Input() totalRange: number = 100;
  @Input() levelKeyPrefix: string = '';
  @Input() dataSource: 'parameters' | 'levels' = 'parameters';
  @Input() width: string = '42px';
  @Input() height: string = '85px';
  @Input() bottom: string = '61.9%';
  @Input() right: string = '69.8%';
  @Input() adaptiveWidth?: string;
  @Input() adaptiveHeight?: string;
  @Input() adaptiveBottom?: string;
  @Input() adaptiveRight?: string;
  @Input() fillColor: string = '#57b7f7';
  @Input() warningThreshold: number = 25;

  dynamicSize = { width: this.width, height: this.height };
  position = { bottom: this.bottom, right: this.right };
  isWarning = false;
  fillPercentage = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.updateDynamicSize();
    this.calculateFillPercentage();
    this.startWarningCheck();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateDynamicSize();
  }

  private updateDynamicSize(): void {
    if (window.innerWidth <= 1280) {
      this.dynamicSize = {
        width: this.adaptiveWidth || this.width,
        height: this.adaptiveHeight || this.height,
      };
      this.position = {
        bottom: this.adaptiveBottom || this.bottom,
        right: this.adaptiveRight || this.right,
      };
    } else {
      this.dynamicSize = { width: this.width, height: this.height };
      this.position = { bottom: this.bottom, right: this.right };
    }
  }

  private calculateFillPercentage(): void {
    const levelKey = this.objectNumber !== undefined ? `${this.levelKeyPrefix}${this.objectNumber}` : this.levelKeyPrefix;
    const rawValue = this.data[this.dataSource]?.[levelKey];
    const cleanedValue = String(rawValue).replace(/["\s]/g, '');
    const levelValue = parseFloat(cleanedValue);
    const isValidLevel = !isNaN(levelValue);

    if (isValidLevel) {
      if (levelValue < this.minLevel) {
        this.fillPercentage = 0;
      } else if (levelValue > this.maxLevel) {
        this.fillPercentage = 100;
      } else {
        this.fillPercentage = ((levelValue - this.minLevel) / this.totalRange) * 100;
      }
    } else {
      this.fillPercentage = 0;
    }
  }

  private startWarningCheck(): void {
    this.intervalId = setInterval(() => {
      if (this.fillPercentage < this.warningThreshold) {
        this.isWarning = !this.isWarning;
      } else {
        this.isWarning = false;
      }
    }, 500);
  }
}
