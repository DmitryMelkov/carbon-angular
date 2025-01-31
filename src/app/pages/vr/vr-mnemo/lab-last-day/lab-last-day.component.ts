import { Component, Input, OnInit } from '@angular/core';
import { LabLastDay } from '../../../../common/types/lab-data';
import { LabService } from '../../../../common/services/vr/lab.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lab-last-day',
  imports: [CommonModule],
  templateUrl: './lab-last-day.component.html',
  styleUrl: './lab-last-day.component.scss'
})
export class LabLastDayComponent implements OnInit {
  @Input() vrId!: string;
  labData: LabLastDay[] = [];
  isLoading = false;

  constructor(private labService: LabService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if (this.vrId) {
      this.isLoading = true;
      this.labService.getLastDayData(this.vrId).subscribe({
        next: (data) => {
          this.labData = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.isLoading = false;
        }
      });
    }
  }
}
