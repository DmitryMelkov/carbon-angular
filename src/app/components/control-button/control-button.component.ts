import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-control-button',
  imports: [CommonModule, MatIcon],
  standalone: true,
  templateUrl: './control-button.component.html',
  styleUrls: ['./control-button.component.scss'],
})
export class ControlButtonComponent implements OnInit, OnChanges {
  @Input() isActive: boolean = false;
  @Input() isDisabled: boolean = false;
  @Output() onClick = new EventEmitter<Event>();

  @Input() borderRadius: string = '0px';
  @Input() iconName: string = '';

  // Размеры для больших экранов
  @Input() iconHeight: string = '24px';
  @Input() iconWidth: string = '24px';

  // Размеры для маленьких экранов
  @Input() iconHeightSmall: string = '18px';
  @Input() iconWidthSmall: string = '18px';
  @Input() maxWidth: number = 1280;

  @Input() paddingTop: string = '2px';
  @Input() paddingBottom: string = '2px';
  @Input() paddingLeft: string = '5px';
  @Input() paddingRight: string = '5px';

  currentIconHeight: string = this.iconHeight;
  currentIconWidth: string = this.iconWidth;

  get buttonClass() {
    return {
      'active-button': this.isActive,
      'disabled-button': this.isDisabled,
    };
  }

  ngOnInit(): void {
    this.adjustIconSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['iconHeight'] ||
      changes['iconWidth'] ||
      changes['iconHeightSmall'] ||
      changes['iconWidthSmall']
    ) {
      this.adjustIconSize();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.adjustIconSize();
  }

  private adjustIconSize(): void {
    if (window.innerWidth < this.maxWidth) {
      this.currentIconHeight = this.iconHeightSmall;
      this.currentIconWidth = this.iconWidthSmall;
    } else {
      this.currentIconHeight = this.iconHeight;
      this.currentIconWidth = this.iconWidth;
    }
  }
}
