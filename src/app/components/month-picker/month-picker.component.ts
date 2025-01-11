import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
  ],
})
export class MonthPickerComponent {
  @Input() selectedMonth: Date = new Date();
  isDatepickerOpen: boolean = false;

  @Output() monthChange = new EventEmitter<Date>();
  @Output() datepickerClose = new EventEmitter<void>();

  onMonthChange(value: Date | null): void {
    if (value) {
      this.selectedMonth = value;
      this.monthChange.emit(this.selectedMonth);
      this.closeDatepicker();
    }
  }

  openDatepicker(): void {
    this.isDatepickerOpen = true;
  }

  closeDatepicker(): void {
    this.isDatepickerOpen = false;
    this.datepickerClose.emit();
  }

  preventKeydown(event: KeyboardEvent): void {
    event.preventDefault();
  }
}
