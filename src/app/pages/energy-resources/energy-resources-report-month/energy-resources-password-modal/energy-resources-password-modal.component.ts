import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-energy-resources-password-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './energy-resources-password-modal.component.html',
  styleUrl: './energy-resources-password-modal.component.scss',
})
export class EnergyResourcesPasswordModalComponent {
  password: string = '';

  constructor(
    private dialogRef: MatDialogRef<EnergyResourcesPasswordModalComponent>
  ) {}

  confirm(): void {
    this.dialogRef.close(this.password);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
