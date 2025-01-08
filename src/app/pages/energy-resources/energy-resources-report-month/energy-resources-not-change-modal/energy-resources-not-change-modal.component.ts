import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-energy-resources-not-change-modal',
  templateUrl: './energy-resources-not-change-modal.component.html',
  styleUrl: './energy-resources-not-change-modal.component.scss'
})
export class EnergyResourcesNotChangeModalComponent {
  constructor(private dialogRef: MatDialogRef<EnergyResourcesNotChangeModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
