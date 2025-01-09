import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ModalHeaderComponent } from '../../../../components/modal-header/modal-header.component';
import { ControlButtonComponent } from '../../../../components/control-button/control-button.component';

@Component({
  selector: 'app-energy-resources-password-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, ModalHeaderComponent, ControlButtonComponent],
  templateUrl: './energy-resources-password-modal.component.html',
  styleUrl: './energy-resources-password-modal.component.scss',
})
export class EnergyResourcesPasswordModalComponent {
  password: string = '';
  errorMessage: string = '';

  constructor(
    private dialogRef: MatDialogRef<EnergyResourcesPasswordModalComponent>
  ) {}

  confirm(): void {
    if (!this.password) {
      this.errorMessage = 'Пароль не введен';
    } else if (!this.isPasswordValid(this.password)) {
      this.errorMessage = 'Пароль неверный';
    } else {
      this.errorMessage = '';
      this.dialogRef.close(this.password);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  private isPasswordValid(password: string): boolean {
    const correctPassword = '123'; // Замените на ваш правильный пароль
    return password === correctPassword;
  }
}
