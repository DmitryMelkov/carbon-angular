import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ControlButtonComponent } from '../../control-button/control-button.component';
import { LabService } from '../../../common/services/vr/lab.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lab-password-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    ControlButtonComponent
  ],
  templateUrl: './lab-password-dialog.component.html',
  styleUrl: './lab-password-dialog.component.scss',
})
export class LabPasswordDialogComponent {
  passwordForm: FormGroup;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<LabPasswordDialogComponent>,
    private fb: FormBuilder,
    private labService: LabService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  onDelete(): void {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    const password = this.passwordForm.value.password;

    this.labService.checkPassword(password).subscribe({
      next: (isValid) => {
        this.isLoading = false;
        if (isValid) {
          this.dialogRef.close(password);
        } else {
          this.passwordForm.get('password')?.setErrors({ incorrect: true });
          this.snackBar.open('Неверный пароль', 'Закрыть', { duration: 3000 });
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Ошибка проверки пароля', 'Закрыть');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
